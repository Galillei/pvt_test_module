<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_MenuRole extends Zend_Db_Table_Abstract{
    protected $_name='T_MENU_ROLE';
    protected $_referenceMap = array(
        'Menu' => array(
            'columns' => 'F_ID_MENU_ITEM',
            'refTableClass' => 'Application_Model_DbTable_MenuItem',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
        'Role' => array(
            'columns' => 'F_ROLE_ID',
            'refTableClass' => 'Application_Model_DbTable_Role',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );

} 