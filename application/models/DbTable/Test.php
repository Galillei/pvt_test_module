<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_Test extends Zend_Db_Table_Abstract{
    protected $_name='T_TEST';
    protected $_primary = 'F_ID';
    protected $_referenceMap = array(
        'User' => array(
            'columns' => 'F_USER_ID',
            'refTableClass' => 'Application_Model_DbTable_User',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
        'Program' => array(
            'columns' => 'F_PROGRAM_ID',
            'refTableClass' => 'Application_Model_DbTable_Program',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        )
    );
    protected function getDbAdapter()
    {
        $this->db = Zend_Registry::get('db');

        return $this->getAdapter();
    }


    public function addTest(array $values)
    {
        $data=[];
        $data['F_USER_ID'] = 1;
        $data['F_PROGRAM_ID']= $values['programms'];
        $data['F_NAME'] = $values['name'];
        $data['F_TIME'] = $values['time'];
        //фильтруем данные, в форме сделать не удалось , не проходит валидация на количество символов
        $filter = new Zend_Filter_HtmlEntities(array('quotestyle' =>ENT_SUBSTITUTE ));
        $data['F_DESCRIPTION'] = $filter->filter($values['description']);
        if( empty( $values['id'] ) )

        {
            return $this->insertTest($data);
        }

        return $this->updateTest((int)$values['id'],$data);


    }
    protected  function insertTest($data)
    {
        $data['F_ID'] = $this->getId()+1;
        if($this->insert($data))
        {
            return true;
        }
        else{
            return false;
        }
    }

    protected function updateTest($id,$data)
    {
        $where = $this->getDbAdapter()->quoteInto('F_ID=?',$id);
        if($this->update($data,$where))
        {
            return true;
        }
        return false;
    }

    public function getId($id=null)
    {
        $db = Zend_Registry::get('db');
        if($id == null)
        {
        $select = $db->select()
            ->from(array('T_TEST'),
            array('F_ID'))
            ->where('ROWNUM=1')
            ->order('F_ID DESC');
        $rows = $db->fetchAll($select);
        return (int)$rows[0]['F_ID'];
        }
        //для проверки, есть ли такой $id базе данных
        if(count($this->find(array($id)))===1)
        {
            return true;
        }
        return false;
    }

} 