<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_Answer extends Zend_Db_Table_Abstract{
    protected $_name='T_TEST_QUESTION_ANSWER';
    protected $_primary = 'F_ID';
    protected $_referenceMap = array(
        'Test' => array(
            'columns' => 'F_TEST_QUESTION_ID',
            'refTableClass' => 'Application_Model_DbTable_Question',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );

    public function addAnswer(array $values)
    {
        $data=[];
        $data['F_ID'] = $this->getId()+1;
        $data['F_TEST_QUESTION_ID'] = $values['q_id'];
        //фильтруем данные, в форме сделать не удалось , не проходит валидация на количество символов
        $filter = new Zend_Filter_HtmlEntities(array('quotestyle' =>ENT_SUBSTITUTE ));
        $data['F_NAME']= $filter->filter($values['text']);
        $data['F_WEIGHT']= $values['correct'];
        $test = new Application_Model_DbTable_Answer();
        if($test->insert($data))
        {
            return $data['F_ID'];
        }
        else{
            return false;
        }
    }

    public function getId()
    {
        $db = Zend_Registry::get('db');
        $select = $db->select()
            ->from(array('T_TEST_QUESTION_ANSWER'),
                array('F_ID'))
            ->where('ROWNUM=1')
            ->order('F_ID DESC');
        $rows = $db->fetchAll($select);
        return (int)$rows[0]['F_ID'];
    }


} 