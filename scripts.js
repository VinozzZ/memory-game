var cards = [];
cards = createCard();
var score = 200;
var theCards = cards.slice();
// var time = 0;
// var runtime = true;
// var changeTime = false;
var gridSize = 16;
var timerInterval = 0;
var won = false;
var GameT = new Timer(60);
var outTime = false;
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
	});

	$('.card-holder').click(function(){
		if ((!won) && (!outTime)){
			GameT.start();
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
					ability(card1, cardsUp);
					if(matchedCards.length == gridSize){
						won = true;
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
	console.log('reset');
	var card = 0;
	var mgHTML = '';
	shuffleCard()
	for(let i = 0; i < gridSize; i++){
		card = theCards.shift();
		if (i % 4 == 0){
			mgHTML += '<div class="card col-sm-3 col-sm-offset-2">';
		}else{
			mgHTML += '<div class="card col-sm-3">';
		}
			mgHTML += `<div class="card-holder ${i}">`;
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

function showCard(cardsUp){
	// var classList = cardsUp.attr("class").split(" ");
	// var currentCard = Number(classList[1]);
	// console.log(currentCard);
	var showed = false;
	var i = 0;
	var nextCard = 0;
	while (!showed) {
		i = Math.floor(Math.random()*16);
		console.log(i)
		nextCard = $(`.${i}`);
		console.log(nextCard);
		if ((!nextCard.hasClass('flip')) && (!nextCard.hasClass('matched'))){
			nextCard.addClass('flip');
			console.log('in if');
			setTimeout(()=>nextCard.removeClass('flip'), 1000);
			showed = true;
		}
	}
}
function updateScore(){
	score--;
	$('.score').text(score);
}


function reset(){
	cards = createCard();
	shuffleCard();
	score = 200;
	theCards = cards.slice();
	card = 0;
	mgHTML = '';
	timerInterval = 0;
	won = false;
	GameT.clearInterval();
	$('.time').html('0');
	GameT = new Timer(60);
	outTime = false;
	$('.score').text(score);
	$('.card-holder').removeClass('flip');
	$('.card-holder').removeClass('matched');
	$('.mg-contents').css('filter', 'none');
	$('.message-container').hide();
}

function ability(card1, cardsUp){
	// display hero's line and ability
	// 1. mercy: Heros never die. Time + 5s
	if (card1.slice(-5,-4) == 4){
		GameT.addTime();
		textGenerater('Heros never die! +5s');
		playSound(card1);
	}
	// 2. Mei: Freeze, don't move
	else if(card1.slice(-5, -4) == 1){
		var nextLine = "<br/>";
		GameT.pauseT();
		textGenerater(`Freeze, don't move!${nextLine}Time pause for 5s`);
		playSound(card1);
		setTimeout(()=>GameT.resume(), 5000);
	}
	else if(card1.slice(-5, -4) == 3){
		GameT.lossTime();
		textGenerater('Die, Die, Die!Lost 5s');
		playSound(card1);
	}
	else if(card1.slice(-5, -4) == 2){
		textGenerater("No one can hide from my sight!");
		playSound(card1);
		showCard(cardsUp);
	}
}

function textGenerater(text){
	if ((won) || (outTime)){
		$('.mg-contents').css('filter', 'blur(5px)');
	}
	setTimeout(()=>$('.message-container').show(), 1000);
	$('.message-text').html(text);
	setTimeout(()=>$('.message-container').hide(), 3000);
}

function playSound(card1){
	const currentCard = card1.slice(-5, -4);
	const audio = $(`.sound-${currentCard}`);
	console.log(audio);
	if(!audio) return;
	audio[0].currentTime = 0;
	audio[0].play();
}
function Timer(seconds){
	this.seconds = seconds;
	this.currentTime = 0;
	this.timeOut = 0;
	this.pauseTime = 0
	this.running = false;
	this.timeInterval = 0;
	this.pause = false;
	this.addedT = false;
	this.lostT = false;
}

Timer.prototype.start = function(){
	if(!this.running){
		this.currentTime = Date.parse(new Date());
		this.timeInterval = setInterval(()=>this.updateTime(0), 1000);
		this.running = true;
	}
};
Timer.prototype.resume = function(){
	this.pause = false;
	clearInterval(this.timeInterval);
	if (this.addedT){
		this.currentTime += 6000;
	}
	if (this.lostT){
		this.currentTime -= 4000;
	}
	this.currentTime += 6000;
	this.timeInterval = setInterval(()=>this.updateTime(), 1000);

};
Timer.prototype.addTime = function(){
	if (!this.pause){
		this.currentTime += 6000;
		clearInterval(this.timeInterval);
		this.timeInterval = setInterval(()=>this.updateTime(), 1000);
	}else {
		this.addedT = true;
	}
}
Timer.prototype.lossTime = function(){
	if (!this.pause){
		this.currentTime -= 4000;
		clearInterval(this.timeInterval);
		this.timeInterval = setInterval(()=>this.updateTime(), 1000);
	}else {
		this.lostT = true;
	}

}
Timer.prototype.pauseT = function(){
	this.pause = true;
	this.pauseTime = this.timeOut
	clearInterval(this.timeInterval);
};

Timer.prototype.display = function(){
	if (this.timeOut > 0){
		$('.time').html(`${this.timeOut/1000}`);
	}else {
		outTime = true;
		$('.time').html('0');
		clearInterval(this.timeInterval);
	}
	if (outTime){
		textGenerater('YOU HAVE RAN OUT OF TIME!')
	}
	if (won){
		$('.time').html('0');
		clearInterval(this.timeInterval);
	}
}
Timer.prototype.updateTime = function(){
	this.timeOut = this.currentTime + this.seconds*1000 - Date.parse(new Date());
	if (!this.pause){
		this.display()
	}else{
		$('.time').html(`${this.pauseTime/1000}`);
	}
};

Timer.prototype.clearInterval = function(){
	clearInterval(this.timeInterval);
}
