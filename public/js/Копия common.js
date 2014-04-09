
document.write( "<script src=\"/js/jquery-1.11.0.min.js\"></script><script src=\"/js/bootstrap.js\"></script>");

document.write( "<script> $( document ).ready( HRMS.start ); </script>" );

var HRMS = new Object();

// create <div> html element

function div( id, classname, style ) {
	
	var x = document.createElement( "div" ); 
	
	id && ( x.id = id );
	
	classname && ( x.className = classname );
	
	style && ( x.style.cssText = style );
	
	return x;
	
}

// create html element

function element( tag, id, classname, style ) {
	
	var x = document.createElement( tag ? tag : "div" ); 
	
	id && ( x.id = id );
	
	classname && ( x.className = classname );
	
	style && ( x.style.cssText = style );
	
	return x;
	
}

function text( x ) {
	
	return document.createTextNode( x );
	
}

// create jquery - wrapped single html element described by css - alike query string

function $create( x ) {
	
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

// post data sent with ajax pagination requests

//
	
HRMS.request = {
	
	sorting: 0,
	
	inversion: 0,
	
	page: 1,
	
	filter: 0,
	
	lastPage: 1,
	
	currentCount: 0,
	
	checkedCount: 0
	
};
	
HRMS.SORTING = 

	[ "TEST_NAME", "TEST_TIME", "COUNTE_QUESTION", "USER_USERNAME" ];
	
HRMS.PAGINATION =

	[ "begin", -1, -2, -1, 0, 1, 2, 1, "end" ];
	
HRMS.PER_PAGE_RESULTS =

	20;

//

// hrms entry point

//

HRMS.start = function() {
	
	HRMS.DOM_setup();
	
	HRMS.loadCurrentPage();
	
	HRMS.loadFilters();
	
}

//

// html dom routines

//

HRMS.DOM_setup = function() {
	
	$( "#examinations > header > div" ).slice( 1 )
	
		.append( element( "a", "", "sorting-icon" ) )
										 
		.wrapInner( element( "a", "", "sorting-href" ) );
		
	$( "#examinations > header > div" ).first().append( 
		
		$( div( "", "checkbox-padding" ) ).append(
						 
			$( div( "main-checkbox", "div-checkbox" ) )
				
		)
			
	);
	
	$( ".action-button" ).addClass( "disabled" );
		
	HRMS.addPagination();
	
}

HRMS.addPagination = function() {
	
	var p = $( "#pagination" );
	
	for( var i = 0; i < HRMS.PAGINATION.length; ++ i ) {
		
		p.append(
						 
			$( element( "button" ) )
			
				.data( "offsetValue", HRMS.PAGINATION[ i ] )
			
				.click( HRMS.paginationClick )
				
				.addClass( HRMS.PAGINATION[ i ] == 0 ? "common-button active" : "common-button" )
				
			);
		
	}
	
	p.children().slice( 2, -2 ).addClass( "numeric" );
	
	p.children().not( ".numeric" ).html( function( index ) { return [ "<<", "<", ">", ">>" ][ index ]; } );
	
	HRMS.updatePagination();
	
}

HRMS.paginationClick = function( event ) {
	
	var x = $( this ).data( "offsetValue" );
	
	if( !x ) return;
		
	HRMS.request.page = 
	
		$.isNumeric( x ) ? HRMS.request.page + x : "begin" == x ? 1 : "end" == x ? HRMS.request.lastPage : 1;
		
	HRMS.loadCurrentPage();
	
}

//

// append onclick events to table headers

//

HRMS.changeTableHeaders = function() {
	
	$( ".sorting-href" )
	
		.click( function( event ) { 
																				 
			HRMS.changeSorting( this.parentNode.className.slice( -1 ) - 2 ); 
			
		} )
		
		.children()
		
			.removeClass( "active inverted" )
			
			.eq( HRMS.request.sorting )
			
				.addClass( HRMS.request.inversion ? "active inverted" : "active" );
			
	$( "#examinations header .div-checkbox" ).click( HRMS.checkboxHeaderClick );
	
}

HRMS.changeSorting = function( x ) {
	
	HRMS.request.page = 1;
	
	HRMS.request.sorting === x 
	
	? 

		HRMS.request.inversion = ! HRMS.request.inversion 
	
	: 
	
		( HRMS.request.sorting = x, HRMS.request.inversion = 0 );
	
	HRMS.loadCurrentPage();
	
}

HRMS.loadCurrentPage = function() {
	
	var 
	
		post_data = {
			
			sorting: HRMS.SORTING[ HRMS.request.sorting ],
			
			order: HRMS.request.inversion ? "DESC" : "ASC",
			
			page: HRMS.request.page,
			
			filter: HRMS.request.filter
			
		};
	
	$.post( "/ajax/ajax/sort", post_data ).done( HRMS.updateTable );
	
}

HRMS.loadFilters = function() {
	
	$.post( "/ajax/ajax/programs" ).done( HRMS.updateFilters );
	
}

HRMS.updateFilters = function( data ) {
	
	var
		
		forge = $( div( 0, 0, "display:none;" ) ),
		
		filtersList = $( "#dropdown-filters" ).replaceWith( forge );
	
	if( ! $.isArray( data ) && ! $.isPlainObject( data ) )
	
		data = JSON.parse(data);
		
	filtersList.append(
							
		$( element( "li" ) ).append(
	
			$( element( "a" ) )
			
				.text( $( "#button-filters" ).text() )
					
				.data( "filterId", 0 )
				
				.click( HRMS.filtersClick )
				
		)
		
	);
	
	for( var i = 0; i < data.length; ++ i) {
		
		filtersList.append(
								
			$( element( "li" ) ).append(
		
				$( element( "a" ) )
				
					.text( data[i].FILTER_NAME )
					
					.data( "filterId", data[i].FILTER_ID )
					
					.click( HRMS.filtersClick )
					
			)
			
		);
		
	}
	
	forge.replaceWith( filtersList );
	
}

HRMS.filtersClick = function( event ) {
	
	$( "#button-filters .button-fixer" ).text( $( this ).text() );
	
	HRMS.request.filter = $( this ).data( "filterId" );
	
	HRMS.request.page = 1;
	
	HRMS.loadCurrentPage();
	
}

HRMS.updateTable = function( data ) {
	
	var 
	
		forge = $( div( 0, 0, "display:none;" ) ),
		
		table = $( "#examinations" ).replaceWith( forge );
		
	table.children( "div" ).remove();
	
	if( ! $.isArray( data ) && ! $.isPlainObject( data ) )
	
		data = JSON.parse(data);
		
	HRMS.updatePagination( + data.page.NUMBER_PAGE, Math.ceil( data.amout[ 0 ].COUNT_TEST / HRMS.PER_PAGE_RESULTS ) );
		
	data = data.items;
	
	if( data.length < 1 ) {
		
		$( "#message-noresults" ).attr( "style", "display: block;" );
		
	} else {
		
		$( "#message-noresults" ).attr( "style", "" );
		
	}
	
	for( var i = 0; i < data.length; ++ i ) {
		
		var row = $( div() );
		
		row.append( 
			
			$( div( "", "checkbox-padding" ) ).append(
							 
				$( div( "", "div-checkbox" ) )
					
					.data( "testId", data[i].TEST_ID ) 
					
					.click( HRMS.checkboxClick )
					
			)
				
		);
		
		row.append( $( div() ).text( data[i].TEST_NAME ) );
		
		row.append( $( div() ).text( data[i].TEST_TIME ) );
		
		row.append( $( div() ).text( data[i].COUNTE_QUESTION ) );
		
		row.append( $( div() ).text( data[i].USER_USERNAME ) );
		
		row.children().slice( 1 ).wrap( div() ).addClass( "table-fixer" );
										
		table.append( row.attr( "id", "examination-" + data[i].TEST_ID ) );
		
	}
	
	forge.replaceWith( table );
	
	HRMS.changeTableHeaders();
	
	HRMS.request.currentCount = data.length;
	
	HRMS.request.checkedCount = 0;
	
	$( "#main-checkbox" ).removeClass( "checked" );
	
}

HRMS.updatePagination = function( page, amount ) {
	
	HRMS.request.lastPage = amount;
	
	if( amount < 2 ) {
		
		$( "#pagination" ).attr( "style", "display: none;" );
		
		return;
		
	}
	
	var x = $( "#pagination" ).children();
	
	x.filter( ".numeric" ).text( 
																	 
		function() { 
		
			return page + $( this ).data( "offsetValue" ); 
			
		}
		
	);
	
	x.slice( 1, -1 ).attr( 
																								
		"style", 

		function( index ) { 
		
			var x = page + $( this ).data( "offsetValue" ); 
			
			return x < 1 || x > amount ? "display: none;"	: ""; 
			
		}
		
	);
	
	x.first().attr( "style", page == 1 ? "display: none;" : "" );
	
	x.last().attr( "style", page >= amount ? "display: none;" : "" );
	
	$( "#pagination" ).attr( "style", "" );
			
}

HRMS.checkboxClick = function( event ) {
	
	var x = $( this ), check = ! x.hasClass( "checked" );
	
	check ? HRMS.request.checkedCount ++ : HRMS.request.checkedCount -- ;
	
	x.toggleClass( "checked", check );
	
	$( "#examination-" + x.data( "testId" ) ).toggleClass( "selected", check );
	
	$( "#main-checkbox" ).toggleClass( "checked", HRMS.request.currentCount == HRMS.request.checkedCount );
	
}

HRMS.checkboxHeaderClick = function() {
	
	var checked = ! $( this ).hasClass( "checked" );
	
	HRMS.request.checkedCount = checked ? HRMS.request.currentCount : 0;
	
	$( "#examinations .div-checkbox" ).toggleClass( "checked", checked );
	
	$( "#examinations > div" ).toggleClass( "selected", checked );
	
}

// end