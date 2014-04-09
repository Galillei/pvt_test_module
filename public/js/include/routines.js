//

// helper functions

//

function valuesArray( target ) {

  var a = new Array();

  for( var i in target )

    a.push( target[i] );

  return a;

}

function $div( id, classname, style, text ) {

  if( $.isPlainObject( id ) ) {

    var x = id;

    id = x.id, classname = x.clname, style = x.css, text = x.text;

  }

  var x = document.createElement( "div" );

  id && ( x.id = id );

  classname && ( x.className = classname );

  text && x.appendChild( document.createTextNode( text ) );

  return $( x );

}



//

// create <div> html element

//

function div( id, classname, text ) {

  if( $.isPlainObject( id ) ) {

    var x = id;

    id = x.id, classname = x.clname, style = x.css, text = x.text;

  }

  var x = document.createElement( "div" );

  id && ( x.id = id );

  classname && ( x.className = classname );

  text && x.appendChild( document.createTextNode( text ) );

  return x;

}

function $element( tag, id, classname, text ) {

  var x = document.createElement( tag ? tag : "div" );

  id && ( x.id = id );

  classname && ( x.className = classname );

  text && x.appendChild( document.createTextNode( text ) );

  return $( x );

}

//

// create html element

//

function element( tag, id, classname, text ) {

  var x = document.createElement( tag ? tag : "div" );

  id && ( x.id = id );

  classname && ( x.className = classname );

  text && x.appendChild( document.createTextNode( text ) );

  return x;

}

//

// wrap each argument into <div> and return as array

//

function divAll() {

  var x = [];

  for( var i = 0; i < arguments.length; ++ i ) {

    x[ i ] = document.createElement( "div" );

    x[ i ].appendChild( document.createTextNode( arguments[ i ] ) );

  }

  return x;

}

//

// wrap each argument and return as array

//

function wrapAll( tag, elements ) {

  var x = [];

  for( var i = 1; i < arguments.length; ++ i ) {

    x[ i - 1 ] = document.createElement( tag );

    x[ i - 1 ].appendChild( document.createTextNode( arguments[ i ] ) );

  }

  return x;

}

//

// create jquery - wrapped single html element described by "[tag][.class[.class]][#id]" string

//

function $new( x ) {

  if ( !x )

    return $( document.createElement( "div" ) );

  var

    a = x.indexOf( "." ),
    b = x.indexOf( "#" ),
    tag = ( a == 0 || b == 0 ) ? "div" : substr( 0, ( a < 0 ? b : a )),
    classes = a < 0 ? "" : substr( a, ( b < 0 ? x.length : b - a )),
    id = b < 0 ? "" : substr( b, x.length );

    return $( document.createElement( tag ) ).addClass( classes.split( "." ).join( " " ) ).attr( "id", id );

}

//

//

//

function chain( tags ) {

  var nodes = [], tag = tags.split( " " );

  for( var i in tag ) {

    nodes[i] = element2( tag[i], arguments[+i+1] );

    if( + i ) nodes[i-1].appendChild( nodes[i] );

  }

  nodes[0].head = nodes[0];

  nodes[0].tail = nodes[ nodes.length - 1 ];

  return nodes[0];

}

//

//

//

function element2( tag, arg ) {

  var x = document.createElement( tag ? tag : arg.tag ? arg.tag : "div" );

  if( arg ) {

    if( arg.id ) x.id = arg.id;

    if( arg.clname ) x.className = arg.clname;

    if( arg.css ) x.setAttribute( "style", arg.css );

    if( arg.text ) x.appendChild( document.createTextNode( arg.text ) );

  }

  return x;

}

//

// make sure ajax response was parsed

//

function verify( data ) {

  if( ! $.isArray( data ) && ! $.isPlainObject( data ) )

    try {

      return JSON.parse( data );

    } catch( e ) {

      console.log( e );

      return new Object();

    }

  else

    return data;

}

//

//

//

function grabFormData( form ) {

  var data = { };

  $( form ).find( "input, textarea" ).each( function( index, input ) { if( input.name ) data[input.name] = input.value; } );

  return data;

}

function setFormData( form, data ) {

  var fx = function( index, input ) {

    if( typeof data[input.name] !== "undefined" )

      input.value = data[input.name];

    else

      input.value = "";

    $( input ).trigger( "input" );

  }

  $( form ).find( "input, textarea" ).each( fx );

  var gx = function( index, dropdown ) {

    var name = $( dropdown ).data( "target" );

    if( typeof data[name] !== "undefined" )

      $( dropdown ).next().find( "a[data-value=\"" + data[name] + "\"]" ).click();

  }

  $( form ).find( ".dropdown" ).each( gx );

}

//

//

//

function clog( x ) {

  console.log( x );

}

//

// put xml data into js object

//

function grabElementData( x ) {

  var data = {};

  var c = $( x ).children().toArray();

  for( var i in c ) {

    var key = c[i].tagName.toLowerCase();

    var value = hasChildNodes( c[i] ) ? grabElementData( c[i] ) : c[i].textContent;

    var index = $( c[i] ).attr( "array_index" );

    //

    // if theres more than one element with the same tag or "array_index"

    // attribute is specified, the resulting object should be an array

    //

    if( defined( index ) )

      if( data[key] )

        data[key][index] = value;

      else

        data[key] = keyArray( index, value );

    else

      if( data[key] )

        if( data[key].push )

          data[key].push( value );

        else

          data[key] = [ data[key], value ];

      else

        if( $( c[i] ).attr( "force_array" ) )

          data[key] = [ value ];

        else

          data[key] = value;

  }

  return data;

}

//

// parse span data into js object

//

function parseSpanBlock( x ) {

  var data = {};

  var c = $( x ).children().toArray();

  for( var i in c ) {

    var tag = $( c[i] );

    var index = tag.data( "index" );

    var key = tag.data( "name" );

    var value = hasChildNodes( c[i] ) ? parseSpanBlock( c[i] ) : c[i].textContent;

    //

    // if theres more than one element with the same tag or "array_index"

    // attribute is specified, the resulting object should be an array

    //

    if( defined( index ) )

      if( data[key] )

        data[key][index] = value;

      else

        data[key] = keyArray( index, value );

    else

      if( data[key] )

        if( data[key].push )

          data[key].push( value );

        else

          data[key] = [ data[key], value ];

      else

        data[key] = value;

  }

  return data;

}

function valuesToKeys( x ) {

  var data = new Object();

  for( var i in x )

    data[x[i]] = undefined;

  return data;

}

function hasChildNodes( x ) {

  var c = x.childNodes;

  for( var i = 0; i < c.length; c ++ )

    if( c[i].nodeType != Node.TEXT_NODE && c[i].nodeType != Node.CDATA_SECTION_NODE )

      return true;

  return false;

}

function defined( x ) {

  return typeof( x ) !== "undefined";

}

function keyArray( key, value ) {

  var x = new Array();

  for( var i = 0; i < arguments.length; i += 2 )

    x[arguments[i]] = arguments[1+i];

  return x;

}



function notEmpty( x ) {

  for( var i in x )

    if( x[i] )

      return true;

  return false;

}













