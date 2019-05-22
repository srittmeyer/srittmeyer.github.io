var scroll_manager = (function() {

	var COOLDOWN_TIME = 100;

	var callback;

	var in_cooldown = false;

	var user_hit_rock_bottom = function() {

		if( !in_cooldown ) {

			in_cooldown = true;
	
			console.log("rock bottom!");

			callback();
		
			setInterval(function() { in_cooldown=false}, COOLDOWN_TIME);
		}
	};

	var scroll_handler = function() {

		var bottom_height = document.body.scrollHeight - window.innerHeight;

		if( window.pageYOffset >= bottom_height ) {

			user_hit_rock_bottom();
		}
	};

	var init = function(c) {

		callback = c;

		window.onscroll = scroll_handler;

	};

	return {
		init:init
		}

})();


/*--
document.addEventListener("DOMContentLoaded", function(event) { 

	scroll_manager.init();

});

--*/
