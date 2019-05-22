var view = (function() {

	var SCREEN_LINES = 20;

	var TYPING_DELAY = 15;

	var initialized = false;

	var char_buffer = [];

	var current_line;

	var screen;

	var init_if_needed = function() {

		if(initialized) {

			return;
		}

		var monitor = document.getElementById('monitor');

		screen = document.createElement("ul");

		screen.setAttribute("class","screen");

		monitor.appendChild(screen);

		start_typist();

		initialized = true;

		reset();
	};

	var reset = function() {

		init_if_needed();

		// clear any existing children

		while(screen.firstChild) {

			screen.removeChild(screen.firstChild);
		}

		for( var i = 0 ; i < SCREEN_LINES ; i++ ) {

			var li = document.createElement("li");

			li.appendChild( document.createTextNode( '\u00A0' ));
			
			screen.appendChild(li);
		}

		current_line = screen.firstChild;

		initialized = true;
	};


	var new_line = function() {

		var li = current_line.nextElementSibling;

		if ( !li ) {

			li = document.createElement("li");

			li.appendChild( document.createTextNode( '\u00A0' ));
			
			screen.removeChild(ul.firstChild);

			screen.appendChild(li);
		}

		current_line = li;

	};

	var type_letter = function(dest, letter) {

			dest.appendChild(document.createTextNode(letter));
	};

	var type_next_letter = function() {

		if ( char_buffer.length > 0 ) {

			var c = char_buffer.shift();
			
			if ( c === "\n" ) {

				new_line();
			
			} else {

				type_letter(current_line, c);
			}

		}

	};

	var start_typist = function() {

		setInterval(type_next_letter, TYPING_DELAY);

	};

	var print = function(msg) {

		init_if_needed();

		for ( var i = 0 ; i < msg.length ; i++ ) {
		
			char_buffer.push( msg.charAt(i) );

		}
	};

	var println = function(msg) {

		print( ( msg || '' ) + '\n');
	};

	return {
		reset:reset,
		print:print,
		println:println
	};
})();

