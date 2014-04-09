<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:14 PM
 */

class Application_Model_DbTable_Object extends Zend_Db_Table_Abstract{
    protected $_name='T_OBJECT';
    protected $_referenceMap = array(
        'Menu' => array(
            'columns' => 'F_MENU_ITEM_ID',
            'refTableClass' => 'Application_Model_DbTable_MenuItem',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );

} 