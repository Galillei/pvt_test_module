
//

// global wrapper

//

var hrm = new Object();

//

// globals

//

hrm.forms = [];

hrm.questions = [];

hrm.openedForm = "";

hrm.newAnswer = "";

//

// hrm entry point

//

hrm.start = function() {

  hrm.domSetup();

  hrm.loadProgrammes();

  hrm.addValidation();

  if( + window.location.hash.slice( 1 ) )

    hrm.loadQuestions();

  else

    hrm.newTest();

}

hrm.loadQuestions = function() {

  var id = + window.location.hash.slice( 1 );

  var fx = function( data ) {

    var x = jQuery.parseXML( data );

    var data = grabElementData( $( x ).find( "data" ) );

    jQuery.extend( hrm, data );

    hrm.updateTable();

  }

  $.post( "/ajax/ajax/questions", { "id": id }, fx );

}

//

// generic dom routines

//

hrm.domSetup = function() {

  var ab = $( ".action-block" );

  ab.find( "button.new" ).click( hrm.addQuestion );

  ab.find( "button.edit" ).click( hrm.editQuestion );

  ab.find( "button.delete" ).click( hrm.deleteQuestions );

  $( ".form button.close" ).click( hrm.closeForm );

  $( ".navigation a[href=\"/\"]" ).click( hrm.exitPage );

  $( ".form button.save" ).prop( "disabled", true ).click( hrm.buttonSaveClick );

  $( ".modal button.ok" ).click( function() { $( this ).parents( ".modal" ).modal( "hide" ); } );

  $( ".modal.onsave button.ok" ).click( hrm.closeForm );

  $( ".modal.oncancel button.yes" ).click( hrm.closeForm );

  $( ".modal.oncancel button.no" ).click( function() { delete hrm.plannedAction; } );

  $( ".modal.ondelete button.yes" ).click( hrm.deleteQuestions );

  $( ".answer button.remove" ).click( hrm.removeAnswer );

  $( ".answer textarea" ).on( "input", hrm.inputAutoSize );

  //$( ".answer .checkbox, .answer .radio" ).click( hrm.toggleAnswer );

  $( "#add-answer" ).click( hrm.addAnswer );

  hrm.forms.tform = $( "#tform" );

  hrm.forms.qform = $( "#qform" );

  hrm.table = $( "#table" );

  hrm.newAnswer = $( ".qform .answer" ).detach().get( 0 );

  var qtypeSwitch = $( "#qform input[name=\"qtype\"]" )[0];

  ( new MutationObserver( hrm.changeAnswerType ) ).observe( qtypeSwitch, { attributes: true } );

}

hrm.exitPage = function( event ) {

  if( event ) event.preventDefault();

  if( hrm.openedForm ) {

    hrm.plannedAction = hrm.exitPage;

    $( ".modal.oncancel" ).modal();

  } else {

    window.location = "/";

  }

}

//

// dom routines needed for validation mechanism

//

hrm.addValidation = function() {

  var vdata = hrm.getValidation();

  hrm.tform = new JForm( "#tform", vdata );

  hrm.qform = new JForm( "#qform", vdata );

}

//

// "save" button onclick callback

//

hrm.buttonSaveClick = function( event ) {

  event.preventDefault();

  var form = $( this ).parents( ".form" );

  var data = grabFormData( form );

  var target = form.data( "target" );

  if( form.attr( "id" ) == "qform" )

    data["qanswer"] = hrm.getAnswers( form );

  $.post( target, data ).done( hrm.saveActionCallback );

}

hrm.getAnswers = function( form ) {

  var fx = function() {

    return {

      text: $( this ).find( "textarea" ).prop( "value" ),

      correct: $( this ).find( ".checkbox, .radio" ).hasClass( "checked" ) ? 1 : 0

    }

  }

  return $( form ).children( ".answer" ).map( fx ).toArray();

}

hrm.setAnswers = function( form, answers, type ) {

  $( form ).children( ".answer" ).remove();

  for( var i in answers ) {

    var a = hrm.addAnswer();

    a.find( "textarea" ).prop( "value", answers[i].text );

    a.find( ".checkbox, .radio" ).toggleClass( "checked", + answers[i].correct ? true : false );

  }

}

//

// ajax "save test" callback

//

hrm.saveActionCallback = function( data ) {

  data = verify( data );

  if( data )

    if( hrm.openedForm == "tform" && data[0] === true ) {

      var x = grabFormData( "#tform" );

      x.id = data[1];

      hrm.test = x;

      $( ".modal.onsave.tform" ).modal();

      hrm.updateTable();

    } else if( hrm.openedForm == "qform" && data.question ) {

      var x = grabFormData( "#qform" );

      x["qanswer"] = hrm.getAnswers( "#qform" );

      if( x.qid )

        delete hrm.questions[x.qid];

      x.qid = data.question;

      hrm.questions[x.qid] = x;

      $( ".modal.onsave.qform" ).modal();

      hrm.updateTable();

    }

  else

    $( ".modal.onerror" ).modal();

}

//

// cancel window closing callback

//

hrm.closeForm = function( event ) {

  if( ! event || ! $( this ).parents().is( ".modal" ) ) {

    $( ".modal.oncancel" ).modal();

    return;

  }

  if( hrm.openedForm == "tform" && ! hrm.test )

    window.location.assign( "/" );

  $( ".modal.oncancel" ).modal( "hide" );

  $( ".form." + hrm.openedForm ).fadeOut( 600 );

  $( ".form-wrapper." + hrm.openedForm ).slideUp( 600 );

  hrm.openedForm = "";

  $( "#new-question-row, #new-test-row" ).attr( "style", "display: none;" );

  $( ".action-block button.new" ).prop( "disabled", false );

  if( hrm.plannedAction ) {

    var x = hrm.plannedAction;

    delete hrm.plannedAction;

    x();

  }

}

//

// load list of categories to choose from

//

hrm.loadProgrammes = function() {

  $.post( "/ajax/ajax/programs" ).done( hrm.updateDropdowns );

}

//

// ajax "load programmes" callback

//

hrm.updateDropdowns = function( data ) {

  data = verify( data );

  var menu = $( "#dropdown-programmes" );

  for( var i = 0; i < data.length; ++ i) {

    var x = $( chain( "li a", null, { text: data[i].FILTER_NAME } ) );

    x.children().attr( "data-value", data[i].FILTER_ID );

    menu.append( x[0] );

  }

  hrm.tform.updateDropdowns();

}

//

// "parse" spans containing validation & other data for fields & controls

//

hrm.getValidation = function() {

  var data = parseSpanBlock( "#validation-data" );

  for( var i in data ) {

    if( data[i].validation.errors ) {

      var v = data[i].validation.errors;

      for( var j in v )

        v[j].expression = new RegExp( v[j].expression );

    }

    if( data[i].validation.noerrors ) {

      var v = data[i].validation.noerrors;

      for( var j in v )

        v[j].expression = new RegExp( v[j].expression );

    }

  }

  return data;

}

//

// rebuild question list

//

hrm.updateTable = function() {

  var t = $( "#table" );

  t.fadeOut( 600 );

  t.children( ".header, .row" ).remove();

  $( "#new-question-row, #new-test-row" ).attr( "style", "display: none;" );

  var app = t.children().detach();

  var row = $( div( "", "header" ) ).data( "target", "tform" ).data( "content", "test" ).click( hrm.editTest );

  var cb = $( element( "img", "", "checkbox checkall" ) ).click( hrm.checkAll );

  var title = $( div( null, "question-title", hrm.test.name ) ).prepend( cb );

  t.append( row.append( title ).wrapInner( div() ) );

  var q = hrm.questions;

  var count = 0;

  for( var i in q ) {

    row = $( div( "", "row" ) ).click( hrm.checkRow ).data( "qid", i ).data( "target", "qform" ).data( "index", count ++ );

    cb = $( element( "img", "", "checkbox" ) );

    title = $( element( "div", "", "question-title", count + ". " + q[i].qtitle ) ).prepend( cb );

    t.append( row.append( title ).wrapInner( div() ) );

  }

  hrm.questionsCount = count;

  $( ".action-block button.new" ).prop( "disabled", false );

  t.append( app );

  t.fadeIn( 600 );

}

hrm.checkRow = function( event ) {

  $( this ).toggleClass( "selected" ).find( ".checkbox" ).toggleClass( "checked" );

  var x = $( ".row" );

  $( ".action-block button.edit" ).prop( "disabled", x.filter( ".selected" ).length != 1 );

  $( ".action-block button.delete" ).prop( "disabled", x.filter( ".selected" ).length == 0 );

  $( "#table .checkbox.checkall" ).toggleClass( "checked", x.not( ".selected" ).length == 0 );

}

//

//

//

hrm.newTest = function() {

  var x = "tform";

  $( "#new-test-row" ).attr( "style", "" );

  hrm.openedForm = x;

  $( ".form-placeholder." + x ).insertAfter( $( "#new-test-row" ) );

  $( "#table" ).fadeIn( 600 );

  $( ".form." + x ).fadeIn( 600 );

  $( ".form-wrapper." + x ).slideDown( 600 );

}

hrm.editTest = function( ) {

  if( hrm.openedForm ) {

    hrm.plannedAction = hrm.editTest;

    $( ".modal.oncancel" ).modal();

    return;

  }

  var row = $( "#table .header" );

  var x = row.data( "target" );

  hrm.tform.setData( hrm.test );

  hrm.openedForm = x;

  $( ".form-placeholder." + x ).insertAfter( row );

  $( ".form." + x ).fadeIn( 600 );

  $( ".form-wrapper." + x ).slideDown( 600 );

}

hrm.editQuestion = function( ) {

  if( hrm.openedForm ) {

    hrm.plannedAction = hrm.editQuestion;

    hrm.closeForm();

    return;

  }

  var row = $( "#table .row.selected" );

  var x = row.data( "target" );

  var i = row.data( "qid" );

  var index = row.data( "index" );

  $( "#qform .question-index" ).text( index + 1 );

  hrm.qform.setData( hrm.questions[i], "" );

  hrm.setAnswers( "#" + x, hrm.questions[i].qanswer, hrm.questions[i].qtype );

  hrm.qform.updateControls();

  hrm.openedForm = x;

  $( ".form-placeholder." + x ).insertAfter( row );

  $( ".form." + x ).fadeIn( 600 );

  $( ".form-wrapper." + x ).slideDown( 600 );

}

//

//

//

hrm.addQuestion = function() {

  if( hrm.openedForm ) {

    hrm.plannedAction = hrm.addQuestion;

    $( ".modal.oncancel" ).modal();

    return;

  }

  hrm.qform.setData( { qowner: hrm.test.id, qtype: 0 }, "" );

  $( "#qform .answer" ).remove();

  for( var i = 0; i < 2; ++ i )

    hrm.addAnswer( 0 );

  $( "#qform .answer img" ).first().toggleClass( "checked", true );

  $( "#qform .question-index" ).text( hrm.questionsCount + 1 );

  $( "#new-question-row .question-index" ).text( hrm.questionsCount + 1 );

  $( "#new-question-row" ).attr( "style", "" );

  $( ".form-placeholder.qform" ).insertAfter( "#new-question-row" );

  $( ".form.qform" ).fadeIn( 600 );

  $( ".form-wrapper.qform" ).slideDown( 600 );

  hrm.qform.updateControls();

  hrm.openedForm = "qform";

}

hrm.addAnswer = function() {

  var type = + $( "#qform input[name=\"qtype\"]" ).prop( "value" );

  var x = $( hrm.newAnswer ).clone( true );

  $( x ).find( "img" ).toggleClass( "checkbox", type == 1 ).toggleClass( "radio", type == 0 );

  $( "#qform" ).append( x );

  hrm.fixAnswerNumbers();

  hrm.qform.updateControls();

  return x.fadeIn( 600 );

}

hrm.removeAnswer = function( event ) {

  var his = $( this );

  var type = + $( "#qform input[name=\"qtype\"]" ).prop( "value" );

  var fx = function() {

    his.parents( ".answer" ).remove();

    if( $( "#qform" ).children( ".answer" ).length < 2 )

      hrm.addAnswer( type );

    if( type == 0 ) {

      var c = $( "#qform .answer img" );

      if( c.filter( ".checked" ).length < 1 )

        c.eq( 0 ).addClass( "checked" );

    }

    hrm.fixAnswerNumbers();

    hrm.qform.updateControls();

  }

  his.parents( ".answer" ).fadeOut( 600, fx );

}

hrm.changeAnswerType = function( mutationRecord ) {

  var type = + mutationRecord[0].target.value;

  if( type == 0 ) {

    var c = $( "#qform .answer .checkbox" ).removeClass( "checkbox" ).addClass( "radio" );

    if( c.filter( ".checked" ).length > 0 )

      c.filter( ".checked" ).slice( 1 ).removeClass( "checked" );

    else

      c.eq( 0 ).addClass( "checked" );

  } else {

    $( "#qform .answer .radio" ).removeClass( "radio" ).addClass( "checkbox" );

  }

  hrm.qform.updateControls();

}

hrm.fixAnswerNumbers = function() {

  var index = 0;

  var fx = function() {

    $( this ).text( ++ index );

  }

  $( "#qform .answer .answer-index" ).each( fx );

}

hrm.checkAll = function( event ) {

  var toggleTo = ! $( this ).hasClass( "checked" );

  $( "#table .row" ).toggleClass( "selected", toggleTo );

  $( "#table .checkbox" ).toggleClass( "checked", toggleTo );

  event.stopPropagation();

}

hrm.deleteQuestions = function( event ) {

  var fx = function() { return $( this ).data( "qid" ); };

  var x = $( "#table .row.selected" ).map( fx ).toArray();

  if( $( this ).hasClass( "yes" ) ) {

    jQuery.post( "/ajax/ajax/qdelete", { qid: x.join( "," ) }, hrm.deleteCallback );

  } else {

    var list = $( "#delete-objects" ).empty();

    for( var i in x )

      list.append( $( element( "li" ) ).text( hrm.questions[x[i]].qtitle.slice( 0, 50 ) ) );

    $( ".modal-message.single-item" ).attr( "style", x.length > 1 ? "" : "display:inline" );

    $( ".modal-message.multi-item" ).attr( "style", x.length > 1 ? "display:inline" : "" );

    $( ".modal.ondelete" ).modal();

  }

}

hrm.deleteCallback = function( data ) {

  data = verify( data );

  if( defined( data.result ) ) {

    var x = data.details;

    for( var i in x )

      if( x[i] )

        delete hrm.questions[i];

    hrm.updateTable();

    $( ".modal.ondelete" ).modal( "hide" );

  }

}

hrm.inputAutoSize = function( event ) {

  var v = $( this ).prop( "value" );

  if( v.indexOf( "\n" ) != -1 || v.length > 45 )

    $( this ).css( "height", "80px" );

  else

    $( this ).css( "height", "" );

}

hrm.validateQform = function( event ) {

  var f = $( "#qform" );

  var x = f.find( "textarea" ).toArray();

  var cb = f.find( ".checkbox.checked, .radio.checked" ).toArray();

  var ok = true;

  if( ! cb.length )

    ok = false;

  else

    for( var i in x )

      if( ! /\S/.test( x[i].value ) )

        ok = false;

  f.find( "button.save" ).prop( "disabled", ! ok );

  if( event )

    event.stopPropagation();

}

// end















