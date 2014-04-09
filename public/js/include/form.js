

function JForm( target, validation, data ) {

  var root = $( target );

  this.root = root;

  this.saveButton = root.find( "button.save" ).get( 0 );

  this.validationData = validation;

  this.updateControls();

  this.addMessages();

  if( data )

    this.setData( data );

}

 + function() {

  var jf = new Object();

  var checkboxOnClick = function() {

    var box = $( this );

    if( box.hasClass( "checkbox" ) ) {

      box.toggleClass( "checked" );

      var all = $( this.parentForm.checkboxControls[this.cbGroup] );

      if( all.filter( ".checked" ).length < 1 )

        this.parentForm.setControlValidated( this.cbGroup, 0, false );

      else

        this.parentForm.setControlValidated( this.cbGroup, 0, true );

    }

    else if( box.hasClass( "radio" ) )

      $( this.parentForm.checkboxControls[this.cbGroup] ).removeClass( "checked" ).filter( this ).addClass( "checked" );

  }

  var cleanups = [ [ /^\s+/gm, "" ], [ /\s+([\n\r]|$)/gm, "$1" ], [ /[\t\ ]+/gm, " " ] ];

  var getErrors = function() {

    if( ! this.validationData )

      return "";

    var specs = this.validationData;

    var msg = new Array();

    for( var i in specs.errors )

      if( ! specs.errors[i].expression.test( this.value ) )

        msg.push( specs.errors[i].message );

    return msg.join( "<br>" );

  }

  var setError = function( msg ) {

    if( msg ) {

      $( this ).addClass( "error" );

      $( "#" + this.name + "-error" ).html( msg ).css( "color", "red" );

    } else {

      $( this ).removeClass( "error" );

      $( "#" + this.name + "-error" ).css( "color", "" );

    }

  }

  var textControlOnInput = function( event ) {

    this.setError( this.getErrors() );

    this.parentForm.validateControl( this );

  }

  var textControlOnBlur = function( event ) {

    var v = this.value;

    for( var i in cleanups )

      v = v.replace( cleanups[i][0], cleanups[i][1] );

    this.value = v;

    $( this ).trigger( "input" );

  }

  jf.updateControls = function() {

    if( this.textControls )

      for( var i in this.textControls )

        $( this.textControls[i] ).off( ".jform" );

    this.textControls = this.getCollection( "input[type=\"text\"], textarea" );

    for( var i in this.textControls )

      $( this.textControls[i] ).on( "input.jform", textControlOnInput ).on( "blur.jform", textControlOnBlur );

    var a = this.allControls = this.getCollection( "input, textarea" );

    for( var i in a )

      for( var j in a[i] ) {

        a[i][j].parentForm = this;

        a[i][j].parentIndex = j;

        a[i][j].setError = setError;

        a[i][j].getErrors = getErrors;

      }

    var c = this.checkboxControls = this.getCollection( ".radio, .checkbox" );

    var fx = function( index ) { this.cbIndex = index; }

    for( var i in c ) {

      $( c[i] ).off( "click.jform" ).on( "click.jform", checkboxOnClick ).prop( "parentForm", this ).prop( "cbGroup", i ).each( fx );

    }

    this.invalidControls = new Object();

    this.updateDropdowns();

    this.validateAll();

  }

  jf.addMessages = function() {

    this.root.find( ".error-message, .tooltip" ).remove();

    var a = this.allControls;

    var v = this.validationData;

    if( v )

      for( var i in a )

        if( v[i] )

          for( var j in a[i] ) {

            var control = a[i][j];

            control.validationData = v[i].validation;

            if( v[i].validation && v[i].validation.errors && v[i].validation.errors.length )

              $( div( i + "-error", "error-message" ) ).insertAfter( control );

            if( v[i].tooltip )

              $( div( "", "tooltip", v[i].tooltip ) ).wrapInner( div( "", "content" ) ).insertAfter( control );

            if( v[i].maxlength )

              control.maxLength = v[i].maxlength;

          }

  }

  jf.validateAll = function() {

    if( this.validationData ) {

      var a = this.allControls;

      for( var i in a )

        for( var j in a[i] )

          this.validateControl( a[i][j] );

      var c = this.checkboxControls;

      for( var i in c )

        if( ! $( c[i] ).hasClass( "checked" ) )

          this.setControlValidated( i, 0, false );

    }

    this.updateState();

  }

  jf.setEnabled = function( enable ) {

    return ! ( this.saveButton.disabled = ! enable );

  }

  jf.getData = function() {

    var data = new Object();

    var a = this.allControls;

    for( var i in a )

      if( a[i].length > 1 )

        data[c[i].name] = $( a[i] ).map( function() { return this.value } );

      else

        data[c[i].name] = c[i][0].value;

    return data;

  }

  jf.setData = function( data, defaultValue ) {

    var c = this.allControls;

    for( var i in c ) {

      if( defined( data[i] ) )

        if( data[i].push )

          $( c[i] ).each( function( index ) { this.value = data[i][index]; } );

        else

          $( c[i] ).each( function() { this.value = data[i]; } );

      else

        $( c[i] ).each( function() { this.value = defined( defaultValue ) ? defaultValue : this.value; } );

      $( c[i] ).removeClass( "error" );

    }

    var d = this.dropdowns;

    for( var i in d )

      if( defined( data[i] ) )

        $( d[i] ).find( ".inner" ).text( function( index ) { return d[i][index].dataMap[data[i]] } );

    this.validateAll();

    this.root.find( ".error-message" ).css( "color", "" );

  }

  jf.validateControl = function( control ) {

    var specs = this.validationData[control.name];

    var ok = true;

    if( specs && specs.validation ) {

      var errors = [ specs.validation.errors, specs.validation.noerrors ];

      for( var j in errors )

        for( var k in errors[j] )

          if( ! errors[j][k].expression.test( control.value ) )

            ok = false;

    }

    this.setControlValidated( control.name, control.parentIndex, ok );

  }

  jf.setControlValidated = function( name, index, value ) {

    if( value )

      delete this.invalidControls[name + index];

    else

      this.invalidControls[name + index] = false;

    this.updateState();

  }

  jf.updateState = function() {

    for( var i in this.invalidControls )

        return this.setEnabled( false );

    return this.setEnabled( true );

  }

  jf.setDropdownValue = function( dropdown, value ) {

    var target = this.allControls[dropdown.name][0];

    target.value = value;

    this.validateControl( target );

    $( dropdown ).find( ".inner" ).text( dropdown.dataMap[value] );

  }

  var dropdownMenuAction = function( event ) {

    this.parentForm.setDropdownValue( this.targetControl, $( this ).data( "value" ) );

  }

  jf.updateDropdowns = function() {

    var d = this.dropdowns = this.getCollection( "button.dropdown" );

    for( var i in d )

      for( var j in d[i] ) {

        var menu = $( d[i][j] ).siblings( ".dropdown-menu" ).find( "a" );

        menu.prop( "parentForm", this ).prop( "targetControl", d[i][j] ).on( "click.jform", dropdownMenuAction );

        var data = new Object();

        var fx = function() {

          data[ $( this ).data( "value" ) ] = $( this ).text();

        }

        menu.each( fx );

        d[i][j].dataMap = data;

      }

  }

  jf.getCollection = function( query ) {

    var x = this.root.find( query ).toArray();

    var c = new Object();

    for( var i in x ) {
			
			var name = x[i].name || x[i].getAttribute( "data-name" ) || x[i].getAttribute( "data-group" );

      if( name )
			
				if( ! c[name] )

	        c[name] = [ x[i] ];
				
				else
				
					c[name].push( x[i] );
					
		}

    return c;
		
	}
	
	JForm.prototype = jf;
	
}();











