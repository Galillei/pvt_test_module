<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 2/13/14
 * Time: 11:57 PM
 */

class Team5_Validate_Name extends Zend_Validate_Abstract
{
    const Name = 'name';
    const LettersNone = 'LettersNone';
    protected $_messageTemplates = array(
        self::Name => 'You used not allowed symbols',
        self::LettersNone =>"%name%'should contain at least one letter"

    );
    public $names;

    public function isValid($value)

    {
//        Используйте буквы русского и английского алфавита верхнего и нижнего регистра, цифры, знаки препинания . , : ; - _ и символы + @ # /
        $patternName = '|^[A-Za-zА-Яа-яЁё0-9.,_;:+@#\ \-\']+$|u';
//    паттерн для проверки есть ли в строке буквы
        $patternLetters = '|[A-Za-zА-Яа-яЁё]+|u';

       if(!preg_match($patternLetters,$value))
       {
           $this->_error(self::LettersNone);
           return false;
       }
        if(!preg_match($patternName,$value))
        {
            $this->_error(self::Name);

            return false;
        }
        
        return true;
    }

    public function __construct($options)
    {
        $this->names = $options['name'];
    }
} 