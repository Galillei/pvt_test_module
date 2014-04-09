<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/22/14
 * Time: 11:05 PM
 * Выборка программы по заданному языку
 */

class Application_Model_DbTable_ProgramProperty extends Zend_Db_Table_Abstract
{
    protected $_name='F_PROGRAM_PROPERTY_VALUE';
    protected $_referenceMap = array(
        'Program' => array(
            'columns' => 'F_PROGRAM_ID',
            'refTableClass' => 'Application_Model_DbTable_Program',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
        'LangCode' => array(
            'columns' => 'F_LANG_ID',
            'refTableClass' => 'Application_Model_DbTable_LangCode',
            'refColumns' => 'F_ID',
            'onDelete' => self::CASCADE
        ),
    );
}