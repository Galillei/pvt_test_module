<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_Question extends Zend_Db_Table_Abstract{
    protected $_name='T_TEST_QUESTION';
    protected $_primary = 'F_ID';
    protected $_referenceMap = array(
        'Test' => array(
            'columns' => 'F_TEST_ID',
            'refTableClass' => 'Application_Model_DbTable_Test',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );


    public function addQuestion(array $values)
    {
        $data=[];
        if ( empty( $values['qid'] ) ) {
            $data['F_ID'] = $this->getId()+1; // Добавляем как новую запись
        } else {
            if (intval($values['qid'])) {
                $data['F_ID'] = $values['qid']; // Создаём с заданным ID (редактирование)
            } else {
                $data['F_ID'] = $this->getId()+1; // Добавляем как новую запись
            }
        }

        $data['F_TEST_ID'] = $values['qowner'];
        $filter = new Zend_Filter_HtmlEntities(array('quotestyle' =>ENT_SUBSTITUTE ));
        $data['F_NAME']= $filter->filter($values['qtitle']);
        $data['F_TYPE']= $values['qtype'];
        $test = new Application_Model_DbTable_Question();
        if($test->insert($data))
        {
            return $data['F_ID'];
        }
        else{
            return false;
        }
    }


    public function deleteQuestion(array $values)
    {
        $ids = explode( ",", $values['qid'] );
        $test = new Application_Model_DbTable_Question();
				$result = true;
        $id_result = array();
				foreach( $ids as $id ) {
	        $where = $test->getAdapter()->quoteInto('F_ID=?',(int)$id);
					$id_result[$id] = $test->delete($where) ? true : false;
  	      $result = $result && $id_result[$id];
				}
				return array( "result" => $result, "details" => $id_result );
    }


    public function getId()
    {
        $db = Zend_Registry::get('db');
        $select = $db->select()
            ->from(array('T_TEST_QUESTION'),
                array('F_ID'))
            ->where('ROWNUM=1')
            ->order('F_ID DESC');
        $rows = $db->fetchAll($select);
        return (int)$rows[0]['F_ID'];
    }

} 