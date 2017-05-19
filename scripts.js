var cards = [];
cards = createCard();
var score = 200;
var theCards = cards.slice();
var time = 0;
var runtime = true;
var changeTime = false;
var gridSize = 16;
// All code will wait until the DOM is ready!
$(document).ready(function(){
	displayCard();

	$('.play-button').click(function(){
		$('.start-container img').css('opacity', '0');
		setTimeout(()=>$('.start-container').hide(), 1000);
		setTimeout(()=>$('.mg-contents').addClass('show-game'), 1500)
		setTimeout(()=>$('.menu-container').show(), 2500);
	})
	$('.reset').click(function(){
		reset();
		displayCard();

	})


		$('.card-holder').click(function(){
				console.log(1);
			if(runtime){
				if(!changeTime){
					time = 60;
					var timerInterval = setInterval(()=>updateTime(timerInterval), 1000);
					changeTime = true;
				}

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
						ability(card1, timerInterval);
						if(matchedCards.length == gridSize){
							textGenerater('YOU HAVE WON THE GAME!');
						}
					}else {
						setTimeout(function(){
							cardsUp.removeClass('flip');
						}, 1000);
						updateScore();
					}
				}
			}
		});


});

function createCard(){
	// add function for different difficulty levels
	for (let i = 1; i < 9; i++){
		var card = `<img src="ow/easy/easy-${i}.png"/>`;
		cards.push(card);
		cards.push(card);
		}
	return cards;
}
function displayCard(){
	var card = 0;
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

function updateScore(){
	score--;
	$('.score').text(score);
}

function updateTime(timerInterval) {
	time -= 1;
	console.log(time);
	if (time > 0){
		$('.time').html(`${time}`);
	}else {
		runTime = false;
		time = 0;
		$('.time').html('0');
		clearInterval(timerInterval);
	}
}

function reset(){
	cards = createCard();
	shuffleCard();
	score = 200;
	theCards = cards.slice();
	time = 0;
	runtime = true;
	startGame = true;
	card = 0;
	mgHTML = '';
	$('.card-holder').removeClass('flip');
	$('.card-holder').removeClass('matched');
	$('.mg-contents').css('filter', 'none');
	$('.message-container').hide();
}

function ability(card1, timerInterval){
	// display hero's line and ability
	// 1. mercy: Heros never die. Time + 5s
	if (card1.slice(-5,-4) == 4){
		changeTime = false;
		time += 5;
	}

	// 2. Mei: Freeze, don't move
	else if(card1.slice(-5, -4) == 1){
		changeTime = false;
		// console.log(timerInterval);
		setTimeout(timerInterval);
		// clearInterval(timerInterval);
		// setTimeout(timerInterval = setInterval(()=>updateTime(timerInterval), 5000));
	}else if(card1.slice(-5, -4) == 3){
		changeTime =false;
		time -= 5;
	}
	// 3. Widow: No one can hide from my sight. show cards around her

}

function textGenerater(text){
	$('.mg-contents').css('filter', 'blur(5px)');
	setTimeout($('.message-container').css('display', 'block'), 1000);
	$('.message-text').html(text);
}
