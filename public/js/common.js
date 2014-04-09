
//

// hrms examinations module

//

// TODO

// - make hrm modules independent & non-conflicting

//


// includes

( function() {

  var x = [ "jquery-1.11.0.min.js", "bootstrap.js", "routines.js", "widgets.js", "form.js", "table.js" ];

  for( var i in x )

    document.write( "<script src=\"/js/include/" + x[i] + "\"></script>" );

} ) ();

// execute after includes

document.write( "<script> $( document ).ready( hrmLoad ); </script>" );

function hrmLoad() {

  var y = [ "examinations", "create-examination" ];

  var fx = function() {

    if( hrm )

      hrm.start();

  };

  for( var i in y )

    if( document.getElementById( y[i] ) ) {

      var x = element( "script" );

      x.src = "/js/special/" + y[i] + ".js";

      x.onload = fx;

      document.head.appendChild( x );
			
		}

}