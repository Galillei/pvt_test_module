<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{


    public function _initJquery()
    {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->addHelperPath("ZendX/JQuery/View/Helper", "ZendX_JQuery_View_Helper");
        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer();
        $viewRenderer->setView($view);
        Zend_Registry::set('view',$view);
        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);
    }

    protected function _initRegistry()
    {
        $resource = $this->getPluginResource('db');
        Zend_Registry::set('db', $resource->getDbAdapter());
    }
    protected function _initRoute()
    {
        $front =Zend_Controller_Front::getInstance();
        //for using path like http://example and by this path we go to AdminContoller must change defaults module, controller and action
        $front->setDefaultModule('admin');
        $front->setDefaultControllerName('Admin');
        $front->setDefaultAction('index');


    }


}

