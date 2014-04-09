<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/28/14
 * Time: 9:50 PM
 */

class Application_Form_AjaxFilter extends Zend_Form{
    public function init()
    {
        $this->setAction('');
        $this->setMethod('post');
        $filter = new Zend_Form_Element_Text('filter');
        $filter->setLabel('Filter')
                ->addValidator('Alpha')
                ->addFilter('StringTrim')
                ->addFilter('HtmlEntities')
            ->isRequired();
        $sort = new Zend_Form_Element_Text('sort');
        $sort->addValidator('Alpha')
            ->addFilter('StringTrim')
            ->addFilter('HtmlEntities')
            ->isRequired();
        $page = new Zend_Form_Element_Text('page');
        $page->addValidator('Digits')
            ->addFilter('StringTrim')
            ->addFilter('HtmlEntities')
            ->isRequired();
        $this->addElement($page);
        $this->addElement($filter);
        $this->addElement($sort);
    }

} 