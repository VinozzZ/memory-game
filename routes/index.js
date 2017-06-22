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
	var userscore = req.body.score;
	console.log(userscore);
	var selectQuery = 'SELECT score FROM users ORDER BY score DESC';
	var buildingscoreList = connectQuery(selectQuery, builtScoreList);
	buildingscoreList.then((scoreList)=>{
		console.log(scoreList);
		if(madeOnList(scoreList)){
			var selectQuery = `SELECT * FROM users WHERE username = '${username}';`;
			return connectQuery(selectQuery, checkExistingUsername);
		}else{
			res.json("sucks");
		}

	}).then((exist)=>{
		if(exist){
			var insertQuery = `INSERT INTO users(username, score) VALUES ('${username}', '${userscore}');`;
			return connectQuery(insertQuery, function(){return true});
		}else{
			var updateQuery = `UPDATE users SET score ='${userscore}' WHERE username = '${username}';`;
			return connectQuery(updateQuery, function(){return true});
		}
	}).then((finished)=>{
		var selectQuery = 'SELECT username,score FROM users ORDER BY score DESC';
		return connectQuery(selectQuery, (results)=>{
			return results;
		})
	}).then((updatedList)=>{
		if(updatedList.length > 9){
			updatedList = updatedList.slice(0, 8);
		}
		res.json(updatedList);
	})


  	// 	if(madeOnList){
  	// 		var selectQuery = `SELECT * FROM users WHERE username = '${username}';`;
			// connection.query(selectQuery, (err, results)=>{
			// 	if(err) throw err;
			// 	// console.log(results);
			// 	if(results.length == 0){
			// 	var insertQuery = `INSERT INTO users(username, score) VALUES ('${username}', '${score}');`;
			// 	connection.query(insertQuery, (err, results)=>{
			// 		if (err) throw err;
			// 		res.json(results);
			// 	});
			// }else { 
			// 	var updateQuery = `UPDATE users SET score ='${score}' WHERE username = '${username}';`;
			// 	connection.query(updateQuery, (err, results)=>{
			// 		if(err) throw err;
			// 		res.json(results);
			// 	});
			// }
			// });
  	// 	}else{
  	// 		res.json("sucks");
  	// 	}

	// });
	function connectQuery(query, callback){
		return new Promise((resolve, reject)=>{
			connection.query(query, (err, results)=>{
				// console.log('test');
				if(err) throw err;
				resolve(callback(results));
			})
		})
	}
	function builtScoreList(results){
		return results;
	}
	function madeOnList(scoreArray){
		for (var data of scoreArray){
			console.log(userscore);
			console.log(data.score);
	  		if(userscore > data.score){
	  			return true;
	  		}
	  	}
	  	return false;
	}
	function checkExistingUsername(results){
		if(results.length == 0){
			return true;
		}else{
			return false;
		}
	}
});


module.exports = router;
