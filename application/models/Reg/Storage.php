<?php

class Application_Model_Reg_Storage
{

    public function getName()
    {

        $inputs = array();

        $inputs["programms"] = array(
				
						"noerrors" => array(
						
								"[1-9]"
								
						)
				
				);

        $inputs["name"] = array();

        $inputs["name"]["tooltip"] = 'Use only letters of English and Russian alphabet, digits, spaces, punctuation marks like full points, commas, colons, semicolon, low lines, dashes, apostrophe and symbols like +, @, #. Maximum 50 symbols.';

        $inputs["name"]["maxlength"] = 50;

        $inputs["name"]["errors"] = array(

            array( '^.+$', "Please, fill in the Name." ),

            array( '^[A-Za-zА-Яа-яЁё0-9.,_;:+@#\ \-\']*$', "Please, use only allowed symbols." ),

            array( '[A-Za-zА-Яа-яЁё]', "Name should contain at least one letter." )

        );

        $inputs["time"] = array();

        $inputs["time"]["tooltip"] = "Use only digits.";

        $inputs["time"]["maxlength"] = 3;

        $inputs["time"]["noerrors"] = array( '[1-9]' );

        $inputs["time"]["errors"] = array(

            array( '^.+$', "Please, fill in the Time, min." ),

            array( '^[0-9 ]*$', "Please, use only allowed symbols." )

        );

        $inputs["description"] = array();

        $inputs["description"]["tooltip"] = "Maximum 500 symbols.";

        $inputs["description"]["maxlength"] = 500;

        $inputs["description"]["errors"] = array();

        $inputs["qtitle"] = array();

        $inputs["qtitle"]["tooltip"] = "Maximum 500 symbols.";

        $inputs["qtitle"]["maxlength"] = 500;

        $inputs["qtitle"]["errors"] = array(

            array( '\S', "Please, fill in the Question." )

        );

        $inputs["qanswer"] = array();

        $inputs["qanswer"]["tooltip"] = "Maximum 500 symbols.";

        $inputs["qanswer"]["maxlength"] = 500;

        $inputs["qanswer"]["errors"] = array(

            array( '\S', "Please, fill in the Question." )

        );

        $out = "";

        foreach( $inputs as $name => $input ) {

            $rules = "";
						
						if( isset( $input["errors"] ) )

							foreach( $input["errors"] as $k => $i )
	
									$rules .= 
									
											"<span data-name=\"errors\" data-index=\"".$k."\">"
											.
												"<span data-name=\"expression\">".$i[0]."</span>"
											.
												"<span data-name=\"message\">".$this->translate( $i[1] )."</span>"
											.
											"</span>";
						
						if( isset( $input["noerrors"] ) )

							foreach( $input["noerrors"] as $k => $i )
	
									$rules .= 
									
											"<span data-name=\"noerrors\" data-index=\"".$k."\">"
											.
												"<span data-name=\"expression\">".$i."</span>"
											.
											"</span>";

            $out .=

                "<span data-name=\"$name\">"
								.
									( isset( $input["tooltip"] ) ? "<span data-name=\"tooltip\">".$this->translate( $input["tooltip"] )."</span>" : "" )
								.
									( isset( $input["maxlength"] ) ? "<span data-name=\"maxlength\">".$input["maxlength"]."</span>" : "" )							
                .
                  "<span data-name=\"validation\">".$rules."</span>"
                .
                "</span>";

        }

        return "<div id=\"validation-data\" style=\"display: none;\">".$out."</div>";

    }



    //for using our Zend_Translate, I must be took view
    private function translate($name)
    {
        $view = Zend_Registry::get('view');
        return $view->translate($name);
    }
}