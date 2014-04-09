<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_Role extends Zend_Db_Table_Abstract{
    protected $_name='T_ROLE';
    protected $_primary = 'F_ID';
    protected $_dependentTables = array(
        'Application_Model_DbTable_UserRole',
    );

} 