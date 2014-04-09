<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:05 PM
 * Выборка принадлежности к прогамме
 */

class Application_Model_DbTable_LangCode extends Zend_Db_Table_Abstract
{
    protected $_name='F_LANG_CODE';
    protected $_primary = 'F_ID';
    protected $_dependentTables = array(
        'Application_Model_DbTable_ProgramProperty',
    );
} 