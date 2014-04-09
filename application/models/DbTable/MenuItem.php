<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:05 PM
 * Выборка принадлежности к прогамме
 */

class Application_Model_DbTable_MenuItem extends Zend_Db_Table_Abstract
{
    protected $_name='F_MENU_ITEM';
    protected $_primary = 'F_ID';
    protected $_dependentTables = array(
        'Application_Model_DbTable_MenuRole',
        'Application_Model_DbTable_Object',
    );
} 