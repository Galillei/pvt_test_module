<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/19/14
 * Time: 8:34 PM
 */

class Application_Model_DbTable_User extends Zend_Db_Table_Abstract
{
    protected $_name='T_USER';
    protected $_primary = 'F_ID';
    protected $_dependentTables = array(
        'Application_Model_DbTable_Test',
        'Application_Model_DbTable_UserRole',
        );


} 