<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/27/14
 * Time: 7:53 PM
 */

class Application_Model_Ajax_Query
{
    private $db;

    public function __construct()
    {
        $this->db = Zend_Registry::get('db');
    }


    // Выборка тестов
    // *привязать к ролям
    public function sort($page,$sort,$type,$filter=null)
    {
        $db = $this->db;
        $select = $db->select()
            ->from(
                array('T_Q'=>'T_TEST_QUESTION'),
                array('T_T.F_ID as TEST_ID',
                    'T_T.F_NAME as TEST_NAME',
                    'T_T.F_TIME as TEST_TIME',
                    'T_U.F_USERNAME as USER_USERNAME',
                    'count(T_Q.F_ID) as COUNTE_QUESTION'
                )
            )
            ->where('T_T.F_PROGRAM_ID '.$filter['mark'].' ?',$filter['id'])
            ->joinright(
                array('T_T'=>'T_TEST'),
                'T_Q.F_TEST_ID = T_T.F_ID',
                array()
            )
            ->joininner(
                array('T_U'=>'T_USER'),
                'T_T.F_USER_ID = T_U.F_ID',
                array()
            )
            ->group(array('T_T.F_ID','T_T.F_NAME','T_T.F_TIME','T_U.F_USERNAME'))
//            ->order('NLSSORT('.'NATURAL_ORDER(lower('.$sort.')),\'NLS_SORT=BINARY_CI\') '.$type)//NATURAL_ORDER is function, which was created from this article http://stackoverflow.com/questions/219982/oracle-how-can-i-implement-a-natural-order-by-in-a-sql-query;
            ->order('NLSSORT('.'REGEXP_REPLACE(lower('.$sort.'),\'[0-9]+\',lpad(REGEXP_SUBSTR(lower('.$sort.'),\'[0-9]+\'), 50, 0)), \'NLS_SORT=BINARY_CI\')'.$type)
            ->limitPage($page,20); // Номер страницы, количество на страницу
//        echo($select);
        $rows = $db->fetchAll($select);
        return $rows;
    }

    // Выборка программ
    public function programs()
    {

        $locale = Zend_Registry::get('Zend_Locale');
        $lang = $locale->getLanguage();
        $db = $this->db;
        $select = $db->select()
            ->from(
                array('T_PPV'=>'T_PROGRAM_PROPERTY_VALUE'),
                array('T_PPV.F_VALUE as FILTER_NAME',
                    'T_PPV.F_PROGRAM_ID as FILTER_ID'
                )
            )
            ->joininner(
                array('T_LC'=>'T_LANG_CODE'),
                'T_PPV.F_LANG_ID = T_LC.F_ID',
                array()
            )
            ->where('T_LC.F_LANG = ?', $lang);
        $rows = $db->fetchAll($select);
        return $rows;
    }

    // Количество тестов
    // *привязать к ролям
    public function paginator($filter)
    {
        $db = $this->db;
        $select = $db->select()
            ->from(
                array('T_T'=>'T_TEST'),
                array('COUNT(T_T.F_ID) AS COUNT_TEST')
                )
            ->where('T_T.F_PROGRAM_ID '.$filter['mark'].' ?',$filter['id']);
        $rows = $db->fetchAll($select);
        return $rows;
    }


    // Вопросы и ответы
    public function questions($value)
    {
        $db = $this->db;
        // Выборка информации по тесту
        $select_test = $db->select()
            ->from(
                array('T_T'=>'T_TEST'),
                array('T_T.F_ID','T_T.F_TIME','T_T.F_PROGRAM_ID','T_T.F_NAME','T_T.F_DESCRIPTION')
            )
            ->where('T_T.F_ID = ?', $value);
        $select_test = $db->fetchAll($select_test);
        $rows['test'] = $select_test[0];
        $rows['test']['F_DESCRIPTION'] = html_entity_decode($rows['test']['F_DESCRIPTION'],ENT_SUBSTITUTE);
        // Выборка информации по тесту

        // Выборка вопросов
        $select_question = $db->select()
            ->from(
                array('T_Q'=>'T_TEST_QUESTION'),
                array('T_Q.F_ID','T_Q.F_NAME','T_Q.F_TYPE')
            )
            ->where('T_Q.F_TEST_ID = ?', $rows['test']['F_ID']);
        $rows['question'] = $db->fetchAll($select_question);
        // Выборка вопросов

        // Выборка ответов
        foreach ($rows['question'] as $key_q => $value_q)
        {
            $select_a = $db->select()
                ->from(
                    array('T_A'=>'T_TEST_QUESTION_ANSWER'),
                    array('T_A.F_ID','T_A.F_NAME','T_A.F_WEIGHT')
                )
                ->where('T_A.F_TEST_QUESTION_ID = ?', $value_q['F_ID']);
            $rows['question'][$key_q]['answer'] = $db->fetchAll($select_a);
        }
        // Выборка ответов

        return $rows;
    }



    public function deleteById($ids)
    {
// format 201,202,203
        $idsArray = explode(',',$ids);
//        our table with Test's
        $idsArray = array_map('intval',$idsArray);
        $testTable = new Application_Model_DbTable_Test();
        $returnArray = ['trues'=>array(),
            'falses'=>array()];
        foreach ($idsArray as $key => $id)

        {
            $where = $testTable->getAdapter()->quoteInto('F_ID=?',(int)$id);
            if($testTable->delete($where))
            {
                $returnArray['trues'][] = $id;
            }
            else{
                $returnArray['falses'][] = $id;
            }
        }

        return $returnArray;
    }



    private function Int()
    {

    }

} 