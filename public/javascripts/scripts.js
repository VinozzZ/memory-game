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
var username;
// All code will wait until the DOM is ready!
$(document).ready(function(){
	$('.scoreboard-container').hide();
	displayCard();
	$cards = $('.mg-contents');
	$cards.isotope({
		itemSelector:'.card',
	});
	$('#start').click(function(){
		$('body').addClass('begin');
		$cards.isotope('shuffle');
		// setTimeout(()=>$('.start-container').hide(), 1000);
		// setTimeout(()=>$('.mg-contents').addClass('show-game'), 1500)
		// setTimeout(()=>$('.menu-container').show(), 2500);
	})
	$('#reset').click(function(){
		reset();
		displayCard();
		// $cards.isotope('shuffle');
		addClicks()
	});

	addClicks()
	$('.name-btn').click(function(){
		username = $('.name-input').val();
		$.ajax({
			method: "POST",
			url: "userInput",
			data:{score: score, username: username},
			success: function(result){
				console.log('success');
				updateBoard();
			}
		})
	});



});

function createCard(){
	// add function for different difficulty levels
	for (let i = 1; i < 9; i++){
		var card = `<img src="/images/easy/easy-${i}.png"/>`;
		cards.push(card);
		cards.push(card);
		}
	return cards;
}
function displayCard(){
	var card = 0;
	var cardBack = '<img src="/images/back.png">'
	var mgHTML = '';
	shuffleCard()
	for(let i = 0; i < gridSize; i++){
		card = theCards.shift();
		if (i % 4 == 0){
			mgHTML += '<div class="card">';
		}else{
			mgHTML += '<div class="card">';
		}
			mgHTML += `<div class="card-holder ${i}">`;
				mgHTML += '<div class="card-front">'+card+'</div>';
				mgHTML += '<div class="card-back">' + cardBack+ '</div>';
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
	var cardsUpTotal = $('.matched');
	console.log(cardsUpTotal);
	if (cardsUpTotal.length >= 14) return 1;
	while (!showed) {
		i = Math.floor(Math.random()*16);
		nextCard = $(`.${i}`);
		if ((!nextCard.hasClass('flip')) && (!nextCard.hasClass('matched'))){
			nextCard.addClass('flip');
			setTimeout(()=>nextCard.removeClass('flip'), 500);
			showed = true;
		}
	}
}

function addClicks(){
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
						$('body').css({
							'transition': "all 2s",
						});
						$('.mg-contents').css('display', 'none');
						// $('.username-container').fadeIn();
						$(".scoreboard-container").fadeIn();
						textGenerater('YOU HAVE WON THE GAME!');
						setTimeout(victorySound, 5000);
					}
				}else {
					setTimeout(function(){
						cardsUp.removeClass('flip');
					}, 850);
					updateScore();
				}
			}else{
				setTimeout(()=>{
					cardsUp.removeClass('flip');
				}, 850);
			}
		}
	});
}
function updateScore(){
	score--;
	$('.score').text(score);
}
//
function updateBoard(){
	var newHTML = ''
	newHTML += '<tr>';
		newHTML += `<td>${username}</td>`;
		newHTML += `<td>${score}</td>`;
	newHTML += '</tr>';
	$('.userdata').append(newHTML);
}
//
// }
// function highScores(){
// 	if (typeof(Storage) !== "undefined"){
// 		var scoreBoard = $('#score-board-body').html();
// 		var lastscore = localStorage["score"];
// 		var newHTML = ''
// 		if (lastscore){
// 			newHTML += '<tr>'
// 				newHTML += `<td>${}
// 		}
// 	}
// }
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
	$('.time').html('');
	GameT = new Timer(60);
	outTime = false;
	$(".scoreboard-container").hide();
	$('.score').text('');
	$('.card-holder').removeClass('flip');
	$('.card-holder').removeClass('matched');
	$('.mg-contents').css('filter', 'none');
	$('.mg-contents').show();
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
	if(!audio) return;
	audio[0].currentTime = 0;
	audio[0].play();
}

function victorySound(){
	if (won){
		const victory = $('.victory');
		victory[0].currentTime = 0;
		victory[0].play();
	}
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
