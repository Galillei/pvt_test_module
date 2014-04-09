
// global wrapper

var hrm = new Object();

//

// globals

//

hrm.SORTING =

  [ "TEST_NAME", "TEST_TIME", "COUNTE_QUESTION", "USER_USERNAME" ];

hrm.PAGINATION =

  [ "begin", -1, -2, -1, 0, 1, 2, 1, "end" ];

hrm.PER_PAGE_RESULTS =

  20;

//

// hrm entry point

//

hrm.start = function() {

  hrm.domSetup();

  hrm.loadCurrentPage();

  hrm.loadProgrammes();

}

//

// current page data

//

hrm.data = {

  sorting: 0, inversion: 0, page: 1, filter: 0, lastPage: 1, currentCount: 0, checkedItems: { }, currentItems: { }

};

//

// dom routines

//

hrm.domSetup = function() {

  hrm.addPagination();

  $( "#examinations #table div.header div" ).slice( 1 ).wrapInner( element( "a", "", "column-header" ) );

  $( "#button-delete" ).click( hrm.deleteExams );

  $( "#modal-button-ok" ).click( hrm.sendDeleteRequest );

  $( "#button-new" ).prop( "disabled", false ).click( function() { window.location.assign( "/createtest" ); } );

  $( "#button-cancel" ).prop( "disabled", false ).click( function() { window.location.assign( "/" ); } );

  $( "#button-save" ).prop( "disabled", false ).click( hrm.sendCreateRequest );

  $( "#button-edit" ).prop( "disabled", true ).click( hrm.editTest );

}

hrm.editTest = function() {

  var x = $( "#table > div.selected" ).data( "examId" ), w = window.location;

  w.assign( w.href.replace( /\/$/, "" ) + "/createtest#" + x );

}

hrm.sendCreateRequest = function() {

  var x = { };

  $( document.forms["create-examination"].elements ).filter( "input, textarea" ).each( function( index, input ) { x[input.name] = input.value; } );

  $.post( "/ajax/createtest", x ).done( hrm.handleCreateResult );

}

hrm.handleCreateResult = function( data ) {

  alert( data );

  window.location.assign( "/" );

}

hrm.addPagination = function() {

  var p = $( "#table-pagination" );

  for( var i = 0; i < hrm.PAGINATION.length; ++ i )

    p.append(

      $( element( "button", "", hrm.PAGINATION[i] == 0 ? "button active" : "button"  ) )

        .data( "pageValue", hrm.PAGINATION[i] )

        .click( hrm.paginationClick )

        .prop( "disabled", hrm.PAGINATION[i] == 0 )

      );

  p.children().slice( 2, -2 ).addClass( "numeric" );

  p.children().not( ".numeric" ).text( function( index ) { return [ "<<", "<", ">", ">>" ][ index ]; } );

}

hrm.paginationClick = function( event ) {

  var x = $( this ).data( "pageValue" );

  if( !x ) return;

  hrm.data.page = $.isNumeric( x ) ? hrm.data.page + x : "begin" == x ? 1 : "end" == x ? hrm.data.lastPage : 1;

  hrm.loadCurrentPage();

}

//

// append onclick events to table headers

//

hrm.changeTableHeaders = function() {

  $( ".column-header" )

    .each( function( index ) { $( this ).data( "columnIndex", index );} )

    .click( function( event ) { hrm.changeSorting( + $( this ).data( "columnIndex" ) ); } )

    .removeClass( "active reverse" )

    .eq( hrm.data.sorting )

      .addClass( hrm.data.inversion ? "active reverse" : "active" );

  $( "#checkall" ).click( hrm.checkAll );

}

hrm.changeSorting = function( x ) {

  hrm.data.page = 1;

  if( hrm.data.sorting === x ) hrm.data.inversion = ! hrm.data.inversion;

  else hrm.data.sorting = x, hrm.data.inversion = 0;

  hrm.loadCurrentPage();

}

hrm.loadCurrentPage = function() {

  var post_data = {

    sorting: hrm.SORTING[ hrm.data.sorting ],

    order: hrm.data.inversion ? "DESC" : "ASC",

    page: hrm.data.page,

    filter: hrm.data.filter

  };

  $.post( "/ajax/ajax/sort", post_data ).done( hrm.updateTable );

}

hrm.loadProgrammes = function() {

  $.post( "/ajax/ajax/programs" ).done( hrm.updateProgrammes );

}

hrm.updateProgrammes = function( data ) {

  data = verify( data );

  var filtersList = $( "#dropdown-programmes" );

  var defaultFilter = $( chain( "li a", null, { clname: "default", text: $( "#button-programmes .inner" ).text() } ) );

  defaultFilter.last().data( "programmeId", 0 ).click( hrm.programmeClick );

  filtersList.append( defaultFilter[0] );

  for( var i = 0; i < data.length; ++ i) {

    var x = $( chain( "li a", null, { text: data[i].FILTER_NAME } ) );

    x.last().data( "programmeId", data[i].FILTER_ID ).click( hrm.programmeClick );

    filtersList.append( x[0] );

  }

}

hrm.programmeClick = function( event ) {

  $( "#button-programmes .inner" ).text( $( this ).text() );

  hrm.data.filter = $( this ).data( "programmeId" );

  hrm.data.page = 1;

  $( "#input-programms" ).attr( "value", hrm.data.filter );

  hrm.loadCurrentPage();

}

hrm.updateTable = function( data ) {

  data = verify( data );

  if( ! data.items )

    data = { page: { NUMBER_PAGE: 0 }, amout: [ { COUNT_TEST: 0 } ], items: [] };

  hrm.updatePagination( + data.page.NUMBER_PAGE, + data.amout[ 0 ].COUNT_TEST);

  var forge = $( div( 0, 0, "display:none;" ) );

  var table = $( "#examinations #table" ).replaceWith( forge );

  table.children( "div" ).slice( 1 ).remove();

  data = data.items;

  hrm.data.currentItems = [];

  hrm.data.checkedCount = 0;

  for( var i = 0; i < data.length; ++ i ) {

    var name = data[i].TEST_NAME;

    if( name.length > 25 && name.indexOf( " " ) == -1 )

      name = name.slice( 0, 25 ) + " " + name.slice( -25 );

    var checked_before = hrm.data.checkedItems[ data[i].TEST_ID ];

    var checkbox = $( element( "img", "", "checkbox" + ( checked_before ? " checked" : "" ) ) ).data( "examId", data[i].TEST_ID ).click( hrm.checkboxClick );

    var cells = $( divAll( name, data[i].TEST_TIME, data[i].COUNTE_QUESTION, data[i].USER_USERNAME ) );

    var row = $( div( "row-" + data[i].TEST_ID, "test-row" + ( checked_before ? " selected" : "" ) ) ).data( "examId", data[i].TEST_ID );

    if( checked_before )

      hrm.data.checkedCount ++ ;

    cells.wrapInner( div( "", "double-row-inner" ) );

    table.append( row.append( $( div() ).append( checkbox ), cells ) );

    hrm.data.currentItems[i] = data[i].TEST_ID;

  }

  forge.replaceWith( table );

  hrm.changeTableHeaders();

  hrm.data.currentCount = data.length;

  $( "#checkall" ).toggleClass( "checked", hrm.data.checkedCount && hrm.data.checkedCount == data.length ? true : false );

  $( "#button-delete" ).prop( "disabled", ! hrm.data.checkedCount );

  $( "#examinations .no-results-message" ).attr( "style", data.length < 1 ? "" : "display: none" );

  $( "#button-edit" ).prop( "disabled", hrm.data.checkedCount != 1 );

}

hrm.updatePagination = function( current_page, amount ) {

  hrm.data.lastPage = amount = Math.ceil( amount / hrm.PER_PAGE_RESULTS );

  if( amount < 2 ) {

    $( "#table-pagination" ).attr( "style", "display: none;" );

    return;

  }

  var x = $( "#table-pagination" ).children();

  x.filter( ".numeric" ).text(

    function() {

      return current_page + $( this ).data( "pageValue" );

    }

  );

  x.slice( 1, -1 ).attr( "style", function( index ) {

      var x = current_page + $( this ).data( "pageValue" );

      return x < 1 || x > amount ? "display: none;"  : "";

    }

  );

  x.first().attr( "style", current_page == 1 ? "display: none;" : "" );

  x.last().attr( "style", current_page >= amount ? "display: none;" : "" );

  $( "#table-pagination" ).attr( "style", "" );

}

hrm.checkboxClick = function( event ) {

  var x = $( this ), check = ! x.hasClass( "checked" ), id = x.data( "examId" );

  hrm.data.checkedItems[ id ] = check;

  check ? hrm.data.checkedCount ++ : hrm.data.checkedCount -- ;

  $( "#button-delete" ).prop( "disabled", ! hrm.data.checkedCount );

  x.toggleClass( "checked", check );

  $( "#row-" + id ).toggleClass( "selected", check );

  $( "#checkall" ).toggleClass( "checked", hrm.data.currentCount == hrm.data.checkedCount );

  $( "#button-edit" ).prop( "disabled", hrm.data.checkedCount != 1 );

}

hrm.checkAll = function() {

  var checked = ! $( this ).hasClass( "checked" );

  var x = hrm.data.currentItems;

  for( var i in x ) hrm.data.checkedItems[ x[i] ] = checked;

  hrm.data.checkedCount = checked ? hrm.data.currentCount : 0;

  $( "#button-delete" ).prop( "disabled", ! checked );

  $( "#table .checkbox" ).toggleClass( "checked", checked );

  $( "#table > div" ).slice( 1 ).toggleClass( "selected", checked );

  $( "#button-edit" ).prop( "disabled", true );

}

hrm.deleteExams = function() {

  var rows = $( "#table > div.selected" );

  var ids = rows.map( function() { return $( this ).data( "examId" ) } ).get();

  var list = $( "#delete-objects" ).empty();

  for( var i = 0; i < rows.length; ++ i )

    list.append( $( element( "li" ) ).text( rows.eq( i ).children().eq( 1 ).children().text() ) );

  $( ".modal-message.single-item" ).attr( "style", rows.length > 1 ? "" : "display:inline" );

  $( ".modal-message.multi-item" ).attr( "style", rows.length > 1 ? "display:inline" : "" );

  $( "#popup" ).modal();

  hrm.data.ids = ids;

}

hrm.sendDeleteRequest = function() {

  $.post( "/delete/" + hrm.data.ids.join( "," ) ).done( hrm.deleteCompleted );

}

hrm.deleteCompleted = function() {

  $( "#popup" ).modal( "hide" );

  hrm.loadCurrentPage();

}

// end