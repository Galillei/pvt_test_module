<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_UserRole extends Zend_Db_Table_Abstract{
    protected $_name='T_USER_ROLE';
    protected $_referenceMap = array(
        'User' => array(
            'columns' => 'F_USER_ID',
            'refTableClass' => 'Application_Model_DbTable_User',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
        'Role' => array(
            'columns' => 'F_Role_ID',
            'refTableClass' => 'Application_Model_DbTable_Role',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );

} 