<?php

class AdminController extends Zend_Controller_Action
{
    public function init()
    {

    }

    public function indexAction()

    {


        $this->view->headTitle($this->view->translate('Show Examinations'));
        $db = Zend_Registry::get('db');

        /*
        //Выборка роли по логину
        $select = $db->select()
            ->from(
                array('T_UR'=>'T_USER_ROLE'),
                array('T_U.F_ID','T_U.F_USERNAME','T_R.F_ROLE_NAME')
            )
            ->joininner(
                array('T_U'=>'T_USER'),
                'T_UR.F_USER_ID = T_U.F_ID',
                array()
            )
            ->joininner(
                array('T_R'=>'T_ROLE'),
                'T_UR.F_ROLE_ID = T_R.F_ID',
                array()
            )
            ->where('T_U.F_USERNAME = ?', 'Peter');
        */


        /*
        //Выборка заголовка меню по роли
        // Type: 1 = вложенная, 0 = просто url
        $select = $db->select()
            ->from(
                array('T_MR'=>'T_MENU_ROLE'),
                array('T_MI.F_ID','T_MI.F_NAME','T_MI.F_TYPE','T_MI.F_ORDER')
            )
            ->joininner(
                array('T_MI'=>'T_MENU_ITEM'),
                'T_MR.F_ID_MENU_ITEM = T_MI.F_ID',
                array()
            )
            ->joininner(
                array('T_R'=>'T_ROLE'),
                'T_MR.F_ID_ROLE = T_R.F_ID',
                array()
            )
            ->where('T_R.F_ROLE_NAME = ?', 'Admin');
       */


        /*
        //Выборка пунктов меню по роли
        // F_MENU_ITEM_ID - принадлежность к заголовку
        $select = $db->select()
            ->from(
                array('T_MR'=>'T_MENU_ROLE'),
                array('T_O.F_ID','T_O.F_MENU_ITEM_ID','T_O.F_LINK','T_O.F_ORDER')
            )
            ->joininner(
                array('T_MI'=>'T_MENU_ITEM'),
                'T_MR.F_ID_MENU_ITEM = T_MI.F_ID',
                array()
            )
            ->joininner(
                array('T_R'=>'T_ROLE'),
                'T_MR.F_ID_ROLE = T_R.F_ID',
                array()
            )
            ->joininner(
                array('T_O'=>'T_OBJECT'),
                'T_O.F_MENU_ITEM_ID = T_MI.F_ID',
                array()
            )
            ->where('T_R.F_ROLE_NAME = ?', 'asd');
        */
        //$rows = $db->fetchAll($select);
        //Zend_Debug::dump($rows);
    }
    public function testAction()
    {
        $this->view->headTitle($this->view->translate('Add Examination'));
        //for print tooltips, reg, which I storage in this model
        $toolTips = new Application_Model_Reg_Storage();
        $this->view->toolTips = $toolTips->getName();
        $test = new Application_Model_DbTable_Test();
        $form = new Application_Form_CreateTest();
        $this->view->form = $form;
////        if ($this->getRequest()->isPost()) {
////            if($form->isValid($this->getRequest()->getParams())){
////                $values = $form->getValues();
////                $values['time'] =(int)$values['time'];
////                var_dump($values);
////                $data = [];
////                $data['F_ID'] = 302;
////                $data['F_USER_ID'] = 1;
////                $data['F_PROGRAM_ID']= $values['programms'];
////                $data['F_NAME'] = $values['name'];
////                $data['F_TIME'] = $values['time'];
////                $test = new Application_Model_DbTable_Test();
////                $test->insert($data);
//            }
//            else {
//                $form->reset();
//                $this->view->form = $form;
//            }
//        }
    }

    public function updateHeaderAction()
    {
//        кидайте сюда id вопросов
        $test = new Application_Model_DbTable_Test();
        $form = new Application_Form_CreateTest();
        $form->populate($test->find(189)->toArray()[0]);
        $this->view->successForm = $form;

    }
}

