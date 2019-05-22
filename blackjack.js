var shoe = (function() {

	var card_suits = ['\u2660','\u2666','\u2663','\u2665'];
	//var card_suits = ["spades","diamonds","clubs","hearts"];
/*--
	var card_names = [
		"ace","two","three","four","five","six","seven","eight",
		"nine","ten","jack","queen","king"];
--*/
	var card_names = [
		" A"," 2"," 3"," 4"," 5"," 6"," 7"," 8",
		" 9","10"," J"," Q"," K"];

	var SUITS_PER_DECK = card_suits.length;
	var CARDS_PER_SUIT = card_names.length;
	var CARDS_PER_DECK = SUITS_PER_DECK * CARDS_PER_SUIT;

	var shoe = [];

	var next_card = 0;

	var card_as_string = function(c) {

		//return card_names[c.number] + " of " + card_suits[c.suit];
		return card_names[c.number] + card_suits[c.suit];
	};

	var card_in_new_deck = function(i) {

		var card = {};

		card.suit = Math.floor( i / CARDS_PER_SUIT ) % SUITS_PER_DECK; 
		card.number = ( i % CARDS_PER_SUIT );

		return card;
	};

	var rand_below = function(max) {

		var raw = window.crypto.getRandomValues(new Uint32Array(1))[0];
		return raw % max;

	};

	var init_shoe = function() {

		next_card = 0;

		for (var i = 0; i < CARDS_PER_DECK; i++) {
			
			var j = rand_below(i + 1);

			if(i != j) {
				
				shoe[i] = shoe[j];
			}

			shoe[j] = card_in_new_deck(i);
		}
	};

	var get_card = function() {

		if( ( shoe.length == 0 ) || ( next_card >= CARDS_PER_DECK ) ) {

			init_shoe();
		
		}

		var card = shoe[next_card];

		next_card++;

		return card;
	};


	return {
		init_shoe:init_shoe,
		get_card:get_card,
		card_as_string:card_as_string
	};
})();

var blackjack = (function() {

	var dealers_hand = [];

	var dealers_hole_card;

	var players_hand = [];

	var game_over = false;

	var hit = function() {

		if(game_over) {

			deal();
			return;
		}

		players_hand.push(shoe.get_card());

		view.println("[player hits]");
		var score = print_hand("player", players_hand);

		if(score > 21) {

			view.println("player busts!");

			game_over = true;

		} else if(score == 21) {
			
			view.println("player has 21");
			
			play_dealers_hand();
		}
	};

	var stand = function() {

		if(game_over) {

			deal();
			return;
		}

		view.println("[player stands]");

		play_dealers_hand();
	};

	var reset = function() {

		game_over = false;

		view.reset();

		dealers_hand = [];

		players_hand = [];

	};

	var play_dealers_hand = function(playerHasBlackjack) {

		var player_score = score_hand(players_hand);

		dealers_hand.push(dealers_hole_card);

		view.println("[dealer shows hole card]");

		var dealer_score = print_hand("dealer", dealers_hand);
	
		if(playerHasBlackjack) {

			if(dealer_score == 21) {

				view.println("two blackjacks!...push...no one wins");
			} else {

				view.println("player wins with blackjack!");

				game_over = true;

				return;
			}

		}

		if(dealer_score == 21) {

			view.println("dealer wins with blackjack...");
			view.println("better luck next time");

			game_over = true;

			return;
		}

		while( (dealer_score < 17) && (dealer_score != 21) ) {

			dealers_hand.push(shoe.get_card());

			view.println("[dealer hits]");

			dealer_score = print_hand("dealer", dealers_hand);
		}

		if(dealer_score > 21) {

			view.println("dealer busts...player wins!");

		} else {


			if(dealer_score == player_score) {

				view.println("push...no one wins");

			} else if(dealer_score > player_score) {

				view.println("dealer wins");

			} else {

				view.println("player wins");
			}

		}

		game_over = true;
	};

	var score_hand = function(cards) {

		var aces = 0;
		var total = 0;

		for(var i = 0 ; i < cards.length ; i++) {
			
			var card = cards[i];

			if(card.number == 0) {

				aces++;
				total++; // start with soft ace

			} else if(card.number > 8) {
				
				total += 10;

			} else {

				total += ( card.number + 1 );
			}

		}

		// promote aces if possible

		for(var i = 0 ; i < aces ; i++) {

			if( (total + 10) <= 21 ) {

				total +=10;
			}

		}

		return total;
	};

	var print_hand = function(label, cards) {

		var score = score_hand(cards);
		
		view.print(label + " (" + (" " + score).slice(-2) + "): ");
		
		var sep = "";

		for(var i = 0 ; i < cards.length ; i++) {

			view.print(sep + shoe.card_as_string(cards[i]));
		
			sep = ", ";
		}

		view.println();

		return score;
	};

	var deal = function() {

		reset();

		players_hand.push(shoe.get_card());

		dealers_hole_card = shoe.get_card();

		players_hand.push(shoe.get_card());

		dealers_hand.push(shoe.get_card());
		
		print_hand("dealer", dealers_hand);
		
		var players_score = print_hand("player", players_hand);

		if(players_score == 21) {

			view.println("player has blackjack!");

			play_dealers_hand(true);
		}

	};

	var add_navigation = function() {

		navbar.add("Hit", blackjack.hit,'H' );
		navbar.add("Stand", blackjack.stand,'S' );
		navbar.add("Deal", blackjack.deal,'D' );

	};

	var play = function() {

		add_navigation();

		deal();

	};

	return {
		play:play,
		hit:hit,
		stand:stand,
		deal:deal
		};
}());


document.addEventListener("DOMContentLoaded", function(event) { 

	blackjack.play();
});
