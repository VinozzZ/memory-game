var express = require('express');
var router = express.Router();
var serverInfo = require('../config/config')
var mysql = require('mysql');

/* Connecting to database */
var connection = mysql.createConnection({
	host: serverInfo.host,
    user: serverInfo.username,
    password: serverInfo.password,
    database: serverInfo.database
});
connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  var selectQuery = 'SELECT username,score FROM users ORDER BY score DESC';
  connection.query(selectQuery, (err, results)=>{
  	if (err) throw err;
  	var scoreArray = [];
  	var usernameArray = [];
  	results.forEach(result=>{
  		// console.log(result);
  		usernameArray.push(result.username);
  		scoreArray.push(result.score);
  	});
  	res.render('index', {usernameArray:usernameArray, scoreArray:scoreArray});
  });
});

router.post('/userInput', (req, res)=>{
	var username = req.body.username;
	var madeOnList = false;
	var score = req.body.score;
	var selectQuery = 'SELECT username,score FROM users ORDER BY score DESC';
  	connection.query(selectQuery, (err, results)=>{
		if (err) throw err;
		var scoreArray = [];
		var usernameArray = [];
		results.forEach(result=>{
			// console.log(result);
			usernameArray.push(result.username);
			scoreArray.push(result.score);
  		});
  		for (data in scoreArray){
  			if(score > data){
  				madeOnList = true;
  			}
  		}
  		if(madeOnList){
  			var selectQuery = `SELECT * FROM users WHERE username = '${username}';`;
			connection.query(selectQuery, (err, results)=>{
				if(err) throw err;
				// console.log(results);
				if(results.length == 0){
				var insertQuery = `INSERT INTO users(username, score) VALUES ('${username}', '${score}');`;
				connection.query(insertQuery, (err, results)=>{
					if (err) throw err;
					res.json(results);
				});
			}else { 
				var updateQuery = `UPDATE users SET score ='${score}' WHERE username = '${username}';`;
				connection.query(updateQuery, (err, results)=>{
					if(err) throw err;
					res.json(results);
				});
			}
			});
  		}else{
  			res.json("sucks");
  		}

	});
});
module.exports = router;
