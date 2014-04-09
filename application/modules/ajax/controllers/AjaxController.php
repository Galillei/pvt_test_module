<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/27/14
 * Time: 7:43 PM
 */

class Ajax_AjaxController extends Zend_Controller_Action
{

    public function init(){
        //$this->_helper->layout->setLayout('test_layout');
        $this->_helper->layout->disableLayout();

    }
    public function sortAction()
    {

        // Проверка пришедших данных и передача нужных
        $page_post = $this->getRequest()->getParam('page'); // Страница выборки
        $page = (empty($page_post)) ? '1' : $page_post;

        $sort_post = $this->getRequest()->getParam('sorting'); // По чему фильтруем
        $sort = ($sort_post == 'TEST_NAME' or $sort_post == 'TEST_TIME' or $sort_post == 'USER_USERNAME' or $sort_post == 'COUNTE_QUESTION') ? $sort_post : 'TEST_NAME';

        $type_post = $this->getRequest()->getParam('order'); // ASC or DESC
        $type = (empty($type_post) or $type_post == 'ASC') ? 'ASC' : 'DESC';

        $filter_post = $this->getRequest()->getParam('filter'); // Фильтр по программам
        $filter['id'] = (empty($filter_post)) ? '9999999' : $filter_post; // Обманка для выборки 1 запросом
        $filter['mark'] = (empty($filter_post)) ? '!=' : '=';
        // Проверка пришедших данных и передача нужных


        $rows_sort = new Application_Model_Ajax_Query();
        $rows_sort = $rows_sort->sort($page,$sort,$type,$filter);
        $rows_paginator = new Application_Model_Ajax_Query();
        $rows_paginator = $rows_paginator->paginator($filter);

        if (empty($page)) {
            $page['NUMBER_PAGE'] = '1';
        }
        $json['page']['NUMBER_PAGE'] = $page;
        $json['amout'] = $rows_paginator;
        $json['items'] = $rows_sort;

        echo $this->_helper->json($json);
    }

    public function programsAction()
    {
        $rows = new Application_Model_Ajax_Query();
        $rows = $rows->programs();
        echo $this->_helper->json($rows);
    }


    public function deleteAction()
    {
        $ids = $this->getParam('idDelete');
//        parse string $ids
        $ajaxQuery = new Application_Model_Ajax_Query();
        $rowsDelete = $ajaxQuery->deleteById($ids);
        echo $this->_helper->json($rowsDelete);

    }

    public function createtestAction()
    {
        $form = new Application_Form_CreateTest();
        if ($this->getRequest()->isPost()) {
            if ($form->isValid($this->getRequest()->getPost()))
            {
                $test = $test = new Application_Model_DbTable_Test();
                if($test->addTest($form->getValues()))
                {

                $this->_helper->json(array(true,$test->getId()));
                }
                else{
                    $this->_helper->json(array('error_server'));
            }

            }

            else{
                $this->_helper->json(array(false,$form->getMessages()));
            }
    }

}

    public function createquestionAction()
    {
//класс для валидации и фильтрации данных приходящих в POST
        $validate = new Team5_Validate_Question();
//        @Zend_Filter_Input
//        @var
        $validate->validate()->setData($this->getRequest()->getPost());
       if($validate->validate()->isValid())
       {

        $test = $test = new Application_Model_DbTable_Question();

        if (intval($_POST['qid'])) {
            $result['question_delete'] = $test->deleteQuestion($this->getRequest()->getPost());
            if (!$result['question_delete']) {
                exit; // временная заглушка, если не удалось удалить
            }
        }

        $result['question'] = $test->addQuestion($this->getRequest()->getPost());

             if($result['question'])
             {
                $answer = $answer = new Application_Model_DbTable_Answer();
                foreach ($_POST['qanswer'] as $a_key => $a_value)
                {
                    $a_value['q_id'] = $result['question'];
                    $result['answer'][] = $answer->addAnswer($a_value);
                }

             } else{
                 $this->_helper->json(false);
             }

            if (!empty($result['question']) and !empty($result['answer'])) {
                echo $this->_helper->json($result);
            } else {
                $this->_helper->json(false);
            }
       }
        else
        {
            $this->_helper->json(false,$validate->validate()->getMessages());
        }

    }

    public function qdeleteAction()
    {

        $test = $test = new Application_Model_DbTable_Question();

        if (!empty($_POST['qid'])) {						
            
						$result['question_delete'] = $test->deleteQuestion($this->getRequest()->getPost());
            
            $this->_helper->json( $result['question_delete'] );
        
				}
				
    }




    public function questionsAction()
    {

        /*$_POST['id'] = '394';*/
        $id = (int)$_POST['id'];
        $rows = new Application_Model_Ajax_Query();
        $rows = $rows->questions($id);

       echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>".
            "<data>".
							"<test>".
								"<id>".$rows['test']['F_ID']."</id>".
								"<time>".$rows['test']['F_TIME']."</time>".
								"<programms>".$rows['test']['F_PROGRAM_ID']."</programms>".
            		"<name><![CDATA[".$rows['test']['F_NAME']."]]></name>".
            		"<description><![CDATA[".$rows['test']['F_DESCRIPTION']."]]></description>".
							"</test>";

        foreach ($rows['question'] as $key_q => $value_q) {

           echo "<questions force_array=\"true\" array_index=\"".$value_q['F_ID']."\">".
									"<qowner>".$rows['test']['F_ID']."</qowner>".
									"<qid>".$value_q['F_ID']."</qid>".
									"<qtype>".$value_q['F_TYPE']."</qtype>".
                	"<qtitle><![CDATA[".html_entity_decode($value_q['F_NAME'],ENT_SUBSTITUTE)."]]></qtitle>";

           foreach ($value_q['answer'] as $key_a => $value_a) {
               echo "<qanswer force_array=\"true\">".
							 		"<correct>".$value_a['F_WEIGHT']."</correct>".
									"<text><![CDATA[".html_entity_decode($value_a['F_NAME'],ENT_SUBSTITUTE)."]]></text>".
								"</qanswer>";
           }

           echo "</questions>";
        }

       echo "</data>";

        //echo $this->_helper->json($rows);
    }

}