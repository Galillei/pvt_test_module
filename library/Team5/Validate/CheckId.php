<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 3/2/14
 * Time: 9:59 AM
 */

class Team5_Validate_CheckId extends Zend_Validate_Abstract
{
    const Message = 'message';
    protected $_messageTemplates = array(
        self::Message => 'This id is invalid');
    public function isValid($value)
    {
        $test = new Application_Model_DbTable_Test();
        if(($test->getId((int)$value)) or ($value=='New'))
        {
            return true;
        }
        $this->_error(self::Message);
        return false;
    }
} 