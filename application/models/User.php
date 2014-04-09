<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 1/25/14
 * Time: 2:37 PM
 */

namespace models;


class Application_Model_User extends Team5_Model{
    public function __construct($id = null)
    {
        parent::__construct(new Application_Model_DbTable_User(), $id);
    }


} 