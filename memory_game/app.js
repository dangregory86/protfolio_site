//variables
var imageHTML1 = "<img class=\"icon\" src=\""
var imageHTML2 = "\" alt=\"icon-pic\" />"
var timer;
var stars = 3;
var previousCard = "";
var previousID = "";
var count = 0;
var numMatched = 0;
var modal = $( "#myModal" );
var won = false;
var anim = false;
var pairOfCards = [];
//an array list of possible cards
var cards = [ 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H' ];
//the card object using jQuery
var card = $( ".card" );

/*
 * @description A function to set the correct image to the relevent letter from the cards array
 * @params a letter from the cards array selects the relevant icon.
 * @returns {string} a string to the correct image file
 */
function setImage( card_letter ) {
	var image;
	switch ( card_letter ) {
		case "A":
			image = "images/card_icons/cloud.png"
			break;
		case "B":
			image = "images/card_icons/note.png"
			break;
		case "C":
			image = "images/card_icons/padlock.png"
			break;
		case "D":
			image = "images/card_icons/pencil.png"
			break;
		case "E":
			image = "images/card_icons/person.png"
			break;
		case "F":
			image = "images/card_icons/sun.png"
			break;
		case "G":
			image = "images/card_icons/tag.png"
			break;
		default:
			image = "images/card_icons/thunder.png"
			break;
	}
	return image;
}

/*
 * @description A function to see if the game is completed with a high enough score
 * If the game has been won then a modal is displayed showing the score and asks if you would like to play again
 * if so the game will restart.
 */
function win() {
	console.log( numMatched );
	if ( numMatched > 15 ) {
		won = true; //sets the boolean of won to true, preventing the game from carrying on
		setTimeout( function() {
			anim = true;
		}, 1000 );
		clearInterval( timer );
		var endTime = $( ".Timer" ).text();
		var congratulations = winStatement( stars );
		//set the modal text
		$( "#modal-text" ).html( congratulations + "<br/>It took you " + ( count + 1 ) + " moves in " + endTime + "<br />Would you like to play again?" );
		modal.css( 'display', 'block' );
	}

}

/*
 * @description A function to decide the win statement to be shown
 * @ param {int} receives an integer of the number of stars remaining
 * @returns {string} string for the correct message to display
 */
function winStatement( num ) {
	if ( num === 3 ) {
		return "Wow, 3 stars, what a champ";
	} else if ( num === 2 ) {
		return "Nearly there... 2 stars";
	} else if ( num === 1 ) {
		return "Better luck next time... 1 star";
	} else {
		return "What happened out there... no stars";
	}
}

/*
 * @description Functions linked to the modal buttons.
 */
function restartYes() {
	restartGame();
	modal.css( 'display', 'none' );
}

function restartNo() {
	modal.css( 'display', 'none' );
}

/*
 * @description A funtion to restart the game.
 */
function restartGame() {
	//reset the score, timer and reset the stars.
	clearInterval( timer );
	previousCard = "";
	previousID = "";
	count = 0;
	numMatched = 0;
	won = false;
	increaseScore();
	$( '.Timer' ).text( "0 Seconds" );
	showStars();
	//reshuffle the deck
	setup();
	turnAllOver();
}

/*
 * @description A function to remove cards every few moves.
 */
function removeStar() {
	if ( stars > 0 ) {
		var star = "#star-" + stars;
		$( star ).hide( "slow" );
		stars--;
	}
}

/*
 * @description A function to show all 3 stars prior to starting a game.
 */
function showStars() {
	stars = 3;
	for ( var star = 1; star < 4; star++ ) {
		var str = "#star-" + star;
		$( str ).show();
	}
}

/*
 * @description A function to increase the score on the screen.
 */
function increaseScore() {
	$( ".moves" ).text( count );
}

/*
 * @description A function to ensure the correct image is returned for each card.
 * @param {int} receives an int which is used substituded to find the array index
 * @returns {String} the letter in that position in the array.
 */
function returnCardDetail( index ) {
	return cards[ index ];
}

/*
 * @description A function to check if the cards matched.
 * @params {string, string}. strings are compared to check for a match
 * @returns {boolean} true or false depending on if they match.
 */
function cardsMatch( txta, txtb ) {
	if ( txta === txtb ) {
		return true;
	} else {
		return false;
	}
}

/*
 * @description A function to iterate through all the card objects and add the correct images
 * ready for the game to start.
 */
function setup() {
	cards = shuffle( cards );
	card.each( function( index, el ) {
		$( this ).attr( 'id', "cd" + index );
		var icon = setImage( returnCardDetail( index ) );
		$( this ).html( imageHTML1 + icon + imageHTML2 );
		$( this ).find( "img" ).hide();
	} );
}

/*
 * @description A function to turn al the cards back over ready to start the game again.
 */
function turnAllOver() {
	card.each( function( index, el ) {
		$( this ).removeClass( 'match open show' );
	} );
}

/*
 * @description A listener function to add a red border to the card as the mouse pases over.
 */
card.mouseover( function( event ) {
	$( this ).css( {
		'border-style': 'solid',
		'border-color': 'red'
	} );
} );

/*
 * @description A listener function to remove the border as the mouse leaves the card.
 */
card.mouseleave( function( event ) {
	$( this ).css( 'border-style', 'none' );
} );


/*
 * @description A function to turn back the previous card if it didn't match
 * @params It takes a card HTML object.
 */
function turnBack() {
	previousCard = pairOfCards[ 0 ];
	currentCard = pairOfCards[ 1 ];
	setTimeout( function() {
		turnCardOver( previousCard ).done( function() {
			previousCard.removeClass( 'open show' );
			previousCard.find( "img" ).hide();
			turnCardOver( previousCard );
		} );
		turnCardOver( currentCard ).done( function() {
			currentCard.removeClass( 'open show' );
			currentCard.find( "img" ).hide();
			turnCardOver( currentCard ).done( function() {
				anim = false;
				pairOfCards = [];
			} );
		} );
	}, 500 );

	console.log( pairOfCards );
}

/*
 * @description a function to change the card look when matched
 * @params. it takes 2 card HTML objects as parameters
 */
function matched( _this, previous ) {
	numMatched += 2;
	win();
	setTimeout( function() {
		anim = false;
	}, 1000 );
	_this.addClass( 'match' );
	previous.addClass( 'match' );
	_this.find( "img" ).show();
	previous.find( "img" ).show();
}

/*
 * @description When a card is clicked on it should turn over.
 * It checks to see if the game has been finished.
 */
card.mousedown( function( event ) {
	if ( won === true || anim === true || pairOfCards.length > 1 ) {} else {
		var thisId = $( this );
		turnCardOver( thisId ).done( function() {
			thisId.find( "img" ).show();
			thisId.addClass( 'open show' );
			turnCardOver( thisId ).done( function() {
				turnOver( thisId );
				anim = false;
			} );
		} );
	}
} );

/*
 * @description a function to turn the card over
 * @params. It takes a card HTML object as it's input
 */
function turnOver( _this ) {
	if ( _this.hasClass( 'match' ) ) {} else if ( pairOfCards.length > 0 && _this.attr( 'id' ) === pairOfCards[ 0 ].attr( 'id' ) ) {} else if ( pairOfCards.length > 1 ) {} else {
		pairOfCards.push( _this );
		if ( count < 1 || pairOfCards.length === 2 ) {
			completeMove( _this );
		}
		count++;
		increaseScore();
	}
}

/*
 * @description a function to complete the moves
 * @params is a card object
 */
function completeMove() {
	if ( count < 1 ) { // starting the game timer/score/previous variables
		console.log( "boo" );
		var start = new Date;
		startTimer( start );
	} else {
		if ( pairOfCards[ 1 ].html() === pairOfCards[ 0 ].html() ) { // if the cards match
			matched( pairOfCards[ 1 ], pairOfCards[ 0 ] );
			pairOfCards = [];
		} else if ( pairOfCards.length > 1 ) { // if the cards don't match turn the previous card back over
			turnBack();
			pairOfCards = [];
		}
	}
	checkClicks();
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle( array ) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while ( currentIndex !== 0 ) {
		randomIndex = Math.floor( Math.random() * currentIndex );
		currentIndex -= 1;
		temporaryValue = array[ currentIndex ];
		array[ currentIndex ] = array[ randomIndex ];
		array[ randomIndex ] = temporaryValue;
	}

	return array;
}

// @description set interval taken from a stack overflow thread
function startTimer( time ) {
	timer = setInterval( function() {
		$( '.Timer' ).text( Math.round( ( new Date - time ) / 1000, 0 ) + " Seconds" );
	}, 1000 );
}

/*
 * @description function to check if the clicks have reached enough to remove a star
 */
function checkClicks() {
	if ( count > 1 && count % 20 === 0 ) {
		removeStar();
	}
}

/*
 * @description All the functions for the animation.
 *	@params for them al is a card HTML object
 * @returns {promise}
 */
function turnCardOver( cardObject ) {
	anim = true;
	return cardObject.slideToggle( "fast" ).promise();
}

setup();