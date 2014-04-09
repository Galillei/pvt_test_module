<?php
/**
 * Created by PhpStorm.
 * User: artem
 * Date: 3/16/14
 * Time: 9:02 PM
 */

class Team5_Filter_CheckArray {

    public function checkArray(array $values)
    {
        $values['correct'] = $values['correct']=='1' ? 1 : 0;
        return $values;
    }

} 