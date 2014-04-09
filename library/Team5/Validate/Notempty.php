<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 2/15/14
 * Time: 11:48 AM
 */

class Team5_Validate_Notempty extends Zend_Validate_NotEmpty
{
    public $name;
    protected $_messageVariables = array(
        'name'=> 'name'
    );

    protected $_messageTemplates = array(
        self::IS_EMPTY=>"Please fill in the '%name%'"
    );
    public function __construct($options)
    {
        parent::__construct();
        $this->name = $options['name'];
    }


} 