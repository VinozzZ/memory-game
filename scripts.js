var cards = [];
cards = createCard();


var theCards = cards.slice();


// All code will wait until the DOM is ready!
$(document).ready(function(){
	var card = 0;
	var gridSize = 16;
	var mgHTML = '';
	shuffleCard()
	for(let i = 0; i < gridSize; i++){
		console.log(theCards);
		card = theCards.shift();
		if (i % 4 == 0){
			mgHTML += '<div class="card col-sm-3 col-sm-offset-2">';
		}else{
			mgHTML += '<div class="card col-sm-3">';
		}
			mgHTML += '<div class="card-holder">';
				mgHTML += '<div class="card-front">'+card+'</div>';
				mgHTML += '<div class="card-back"></div>';
			mgHTML += '</div>';
		mgHTML += '</div>';
	}
    $('.mg-contents').html(mgHTML);
	$('.play-button').click(function(){
		$('.start-container img').css('opacity', '0');
		setTimeout(()=>$('.start-container').hide(), 1000);
		setTimeout(()=>{
			$('.mg-contents').show();
			$('.mg-contents').addClass('imhere');
		}, 2000)
	})

	$('.card-holder').click(function(){
		$(this).toggleClass('flip');
		var cardsUp = $('.flip');
		if(cardsUp.length == 2){
			var card1 = cardsUp[0].children[0].children[0].src;
			// var card2 = cardsUp[1].find('.card-front img');
			var card2 = cardsUp[1].children[0].children[0].src;
			if (card1 === card2){
				cardsUp.removeClass('flip');
				cardsUp.addClass('matched');
				var matchedCards = $('.matched');
				if(matchedCards.length == gridSize){
					alert("You have won the game!");
				}
			}else {
				setTimeout(function(){
					cardsUp.removeClass('flip');
				}, 1000);
			}
		}
	})

});

function createCard(){
	var catg = ['of-', 'df-', 'tk-', 'sp-'];
	for (let c = 0; c < 4; c++){
		for (let i = 1; i < 3; i++){
			if ((catg[c] == 'tk-') && (i > 5)){
				break;
			}else if((catg[c] == 'sp-') && (i > 4)){
				break;
			}else{
				var card = `<img src="ow/${catg[c]+i}.png"/>`;
				cards.push(card);
				cards.push(card);
			}
		}
	}
	return cards;
}
function shuffleCard(){
	var temp = 0;
	for (let i = 0; i < 500; i++){
		var random1 = Math.floor(Math.random()*16);
		var random2 = Math.floor(Math.random()*16);
		temp = theCards[random1];
		theCards[random1] = theCards[random2];
		theCards[random2] = temp;
	}
}
