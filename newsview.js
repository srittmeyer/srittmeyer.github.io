var view = (function() {

	var initialized = false;

	var screens = [];

	var first_screen = function() {

		return screens[0];
	};

	var last_screen = function() {

		return screens[screens.length - 1];

	};

	var current_line = function(screen) {

		if( !screen ) {

			screen = first_screen();
		}

		return screen.lastChild;
	};

	var new_screen = function() {

		var monitor = document.getElementById('monitor');
		
		var ul = document.createElement("ul");

		ul.setAttribute("class","screen");

		if( screens.length > 0 ) {

			monitor.insertBefore(ul, first_screen());

		} else {


			monitor.appendChild(ul);
		}

		screens.unshift(ul);

		first_screen().appendChild(document.createElement("li"));

	};

	var init_if_needed = function() {

		if(initialized) {

			return;
		}

		new_screen();

		initialized = true;

		new_line(first_screen());
	};

	var new_line = function(screen) {

		li = document.createElement("li");

		screen.appendChild(li);
	};

	var type_to_current_line = function(screen, text, c, url) {

		var n = document.createTextNode(text);

		if(url) {

			var a = document.createElement("a");

			a.href = url;
			
			a.appendChild(n);

			n = a;
		}

		if(c) {

			var s = document.createElement("div");

			s.setAttribute("class",c);

			s.appendChild(n);

			n = s;
		}

		current_line(screen).appendChild(n);
	};

	var type_text = function(screen, text, c, url) {

		var lines = text.split("\n");

		for( var i = 0 ; i < lines.length ; i++ ) {

			if( i > 0 ) { 
				
				new_line(screen);
			}
		
			var line = lines[i];

			if (line.length > 0 ) {
	
				type_to_current_line(screen, text, c, url);
			}
		
		};

	};

	var print = function(text, c, url) {

		init_if_needed();

		type_text(first_screen(), text, c, url);
	};

	var println = function(text, c) {

		print( ( text || '' ) + '\n', c);
	};

	var print_last = function(text, c, url) {


		init_if_needed();

		type_text(last_screen(), text, c, url);
	};

	return {
		print:print,
		println:println,
		print_last:print_last,
		new_screen,new_screen
	};
})();

