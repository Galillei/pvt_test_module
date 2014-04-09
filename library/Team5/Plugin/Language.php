<?php


class Team5_Plugin_Language extends Zend_Controller_Plugin_Abstract
{

        public function preDispatch(Zend_Controller_Request_Abstract $request)
    {

        // Язык не нужно записывать в сессию, для этого у нас есть Zend_Locale
        // и достаётся язык так: $locale = Zend_Registry::get('Zend_Locale');
        // $lang = $locale->getLanguage();
        $lang_session = new Zend_Session_Namespace('Zend_lang');
        if ($request->getParam('lang','')) {
            if (
                $request->getParam('lang','') !== 'en' and
                $request->getParam('lang','') !== 'ru'
            ) {
                $request->setParam('lang','en'); // Default language
            }
            $lang = $request->getParam('lang');
        } else {
            $lang = ($lang_session->lang) ? $lang_session->lang : 'en';
        }
        $locale = ($lang == 'en') ? 'en_US' : 'ru_RU';
        $lang_session->lang = $lang;

        $zl = new Zend_Locale();
        $zl->setLocale($locale);
        $view = Zend_Registry::get('view');
        $view->language = $lang;
        Zend_Registry::set('Zend_Locale', $zl);
        $translate = new Zend_Translate('csv', APPLICATION_PATH . '/languages/'. $locale . '.csv' , $lang);
//            Zend_Translate for errors message
        $translate2 = new Zend_Translate('array',APPLICATION_PATH . '/languages/locale/'.$lang, $lang);
        Zend_Registry::set('Zend_Translate', $translate);
        Zend_Registry::set('Zend_Translate_errors_message', $translate2);
    }

}