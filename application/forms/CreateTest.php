<?php

class Application_Form_CreateTest extends Zend_Form
{
   protected $_StringLength;

    public function init()
    {
        $this->setAction('')
            ->setMethod('post')
            ->setName('createTest')
            ->setOptions(array('id'=>'createTestForm'));
        $hidden = new Zend_Form_Element_Hidden('id');
        $hidden->setOptions(array('value'=>'New'))
              ->addValidator(new Team5_Validate_CheckId());
        $name = new Zend_Form_Element_Text('name');
        $name->setLabel($this->view()->translate('Name'))
            ->setOptions(array('size'=>26,'title'=>$this->view()->translate('Use only letters of English and Russian alphabet, digits, spaces, punctuation marks like full points, commas, colons, semicolon, low lines, dashes, apostrophe and symbols like +, @, #. Maximum 50 symbols.')))
//            ->addValidator('Alnum')
            ->setRequired('true')
//        'name' only for errorMessage view like as '%name%'should contain at least one letter"
            ->addValidator(new Team5_Validate_Notempty(array('name'=>$this->view()->translate('Name'))),'true')
            ->addValidator(new Zend_Validate_StringLength(array('min'=>0,'max'=>50,'encoding'=> 'UTF-8')),'true')
            ->addValidator(new Team5_Validate_Name(array('name'=>$this->view()->translate('Name'))))
            ->addFilter('StringTrim')
            ->addFilter('HtmlEntities');

        $description = new Zend_Form_Element_Textarea('description');
        $description->setLabel($this->view()->translate('Description'))
                    ->setOptions(array('cols'=>50,'rows'=>5,'title'=>$this->view()->translate('Maximum 500 symbols.')))
                    ->addValidator(new Zend_Validate_StringLength(array('min'=>0,'max'=>500,'encoding'=> 'UTF-8')),'true')
                    ->addFilter('StringTrim');
//                    ->addFilter('HtmlEntities');



//(1[012]|[1-9]):[0-5][0-9]
        $time = new Zend_Form_Element_Text('time');
        $time->setLabel($this->view()->translate('Time').', '.$this->view()->translate('min'))
            ->setOptions(array('size'=>5))
            ->setRequired('true')
            ->addValidator('NotEmpty')
            ->addValidator(new Zend_Validate_LessThan(array('max'=>1001)))
            ->addValidator(new Zend_Validate_GreaterThan(array('min'=>0)))
            ->addValidator('Int');
//            ->addValidator(new Zend_Validate_Date(array('format' => 'h : i' )))
//        pattern for validate time in 12-ours format
//            ->addValidator(new Zend_Validate_Regex(array('pattern'=>'%^(0[0-9]|1[012]):[0-5][0-9]$%')));


        $programms = new Zend_Form_Element_Select('programms');
        $programms->setLabel($this->view()->translate('Programme'))
            ->setRequired(true)
            ->addFilter('HtmlEntities')
            ->addFilter('StringTrim')
            ->addValidator(new Zend_Validate_GreaterThan(0))
            ->addFilter('StringToUpper');
        $programms->addMultiOption(0,$this->view()->translate('Select a Programme'));
        foreach($this->getProgramme() as $c)
        {
            $programms->addMultiOption($c['FILTER_ID'],$c['FILTER_NAME']);
        }


        $submit = new Zend_Form_Element_Submit('submit');
        $submit->setOptions(array('class'=>'submit','name'=>$this->view()->translate('Save')));
        $this->localization();
//        for hide message of errors from server
//        $name->removeDecorator('Errors');
//        $description->removeDecorator('Errors');
//        $time->removeDecorator('Errors');
//        add element to form
        $this->addElement($hidden)
             ->addElement($programms)
             ->addElement($name)
             ->addElement($description)
             ->addElement($time)
             ->addElement($submit);
    }




    private  function getProgramme()
    {
        $prog = new Application_Model_Ajax_Query();
        return $prog->programs();
    }

    private function localization()
    {
        $translate = Zend_Registry::get('Zend_Translate_errors_message');
        Zend_Validate_Abstract::setDefaultTranslator($translate);
        Zend_Form::setDefaultTranslator($translate);
    }

    private function view()
    {
        return $this->getView();
    }



}

