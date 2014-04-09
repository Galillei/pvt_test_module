<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 3/16/14
 * Time: 8:07 PM
 */

class Team5_Validate_Question
{
  protected $filters;
  protected $validates;
  protected $values;

   public function __construct()
   {
       $callbackFilter = new Team5_Filter_CheckArray();
       $this->filters = array(
           'qid'=>array('Int'),
           'qtype'=>array('Int'),
           'qowner'=>array('Int'),
           'qindex'=>array('Int'),
           'qtitle'=>array('StringTrim'),
           'qanswer'=>array(new Zend_Filter_Callback(array($callbackFilter,'checkArray'))),
       );
       $callbackValidates = new Team5_Validate_Answers();
       $this->validates = array(
           'qid'=>array(),
           'qtype'=>array('Int',array('Between',0,1)),
           'qowner'=>array(),
           'qindex'=>array(),
           'qtitle'=>array(new Zend_Validate_StringLength(array('min'=>0,'max'=>500,'encoding'=> 'UTF-8'))),
           'qanswer'=>array(new Zend_Validate_Callback($callbackValidates)),
       );

   }
// @todo возможно использовать Zend_Filter_Callback совместно с Zend_Filter_Input и метод setData

    public function validate()
    {
        $filter = new Zend_Filter_Input($this->filters,$this->validates);

        return $filter;
    }


} 