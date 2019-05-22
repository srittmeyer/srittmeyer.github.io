var nytapi = (function() {

	var API_KEY = "22ec7eff4b924b3088d108ea8d064204";

	var NEWSWIRE_URL = "https://api.nytimes.com/svc/news/v3/content/nyt/all.json?limit=20&api-key=" + API_KEY;

	var get = function(url, callback) {

	var oReq = new XMLHttpRequest();
		
		oReq.onload = function (e) {
			
			var xhr = e.target;
    		
			if (xhr.responseType === 'json') {
            		
				callback(xhr.response);
	        	
			} else {
		        	
				callback(JSON.parse(xhr.responseText));
			}
		};
	
		oReq.open('GET', url, true);
		oReq.responseType = 'json';
		oReq.send();

	};

	var newswire = function(callback, offset) {

		var url = NEWSWIRE_URL;

		if(offset) {

			url += "&offset=" + offset;
		}

		return get(url, callback);

	};

	return {
		newswire:newswire
		}
})();

var nyt = (function() {

	var REFRESH_INTERVAL = 5 * 60 * 1000;

	var initialized = false;

	var seen = [];

	var init = function() {

		navbar.add("Refresh", nyt.refresh);

		scroll_manager.init(nyt.more);

		setInterval(refresh, REFRESH_INTERVAL);

		initialized = true;
	};

	var refresh = function() {

		if( !initialized ) {

			init();	
		}

		nytapi.newswire(nyt.adapt);
	};

	var more = function() {

		nytapi.newswire(nyt.adapt_last, seen.length);

	};

	var print_item = function(print, r) {

		var t = r.section;

		if( r.subsection && r.subsection.length > 0 ) {

			t += (" - " + r.subsection);
		}

		if( r.published_date ) {

			t += (" - " + r.published_date);

		}

		print(r.title, "news-title", r.url);

		print(t , "news-stats");


		if(r.abstract) {

			print(r.abstract, "news-abstract");
		}

	};

	var adapt_last = function(data, requestObj) {

		adapt(data, requestObj, view.print_last);
	};

	var adapt = function(data, requestObj, print) {

		if( !print ) {

			print = view.print;
		}

		var needs_new_screen = (seen.length > 0);

		if(data.results) {

			for ( var i = 0 ; i < data.results.length ; i++ ) {

				var r = data.results[i];

				if(seen.indexOf(r.url) === -1) {

					if(needs_new_screen) {
						
						view.new_screen();
					
						needs_new_screen = false;
					}

					print_item(print, r);
				}

				seen.push(r.url);

			}
		}

	};

	return {
		refresh:refresh,
		adapt:adapt,
		more:more,
		adapt_last:adapt_last
		}

})();

document.addEventListener("DOMContentLoaded", function(event) { 

	nyt.refresh();
});
