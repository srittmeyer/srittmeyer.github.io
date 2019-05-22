var navbar = (function() {

	var handler_installed = false;

	var handlers = {};

	var keypress_handler =  function(evt) {
		
			evt = evt || window.event;

			for(var key in handlers) {

				if ( handlers.hasOwnProperty(key) 
					&& ( evt.keyCode == key ) ) {

					handlers[key]();
				}
			}
	};

	var add_key_handler = function(key, handler) {

		var keycode = key.charCodeAt(0);

		handlers[keycode] = handler;
	};

	var decorate = function(name, key) {

		key = key.toUpperCase();

		var i = name.toUpperCase().indexOf(key);

		var decorated = name;
		
		if( i >= 0 ) {

			decorated = name.slice(0,i) + "[" + key + "]" + name.slice(i + 1);
		}
		
		return decorated;
	};

	var add = function(name, handler, key) {

		if( !handler_installed ) {

			document.onkeydown = keypress_handler;

			handler_installed = true;

		}

		if(key) {

			key = key.toUpperCase();

			add_key_handler(key, handler);

			name = decorate(name, key);
		}

		var contentNode = document.getElementById('navbar');
		
		var listItem = document.createElement("li");

		listItem.appendChild(document.createTextNode(name));

		contentNode.appendChild(listItem);

		if(handler) {

			listItem.onclick = handler;
		}

	};

	return {
		add:add
		};
}());

