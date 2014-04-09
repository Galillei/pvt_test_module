<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 3/17/14
 * Time: 9:29 PM
 */

class Team5_Validate_Answers {


    public function __invoke($value)
    {
        $validNull = new Zend_Validate_NotEmpty();
        $validLength = new Zend_Validate_StringLength(array('min'=>0,'max'=>500,'encoding'=> 'UTF-8'));
            if(!((isset($value['text'])) && (isset($value['correct'])) && ($validNull->isValid($value['text'])) && $validLength->isValid($value['text'])))
            {
              return false;
            }

        return true;
    }

} 