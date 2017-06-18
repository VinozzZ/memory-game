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
  res.render('index', { title: 'Express' });
});

router.post('/userInput', (req, res)=>{
	var username = req.body.username;
	var score = req.body.score;
	var selectQuery = `SELECT * FROM users WHERE username = '${username}';`;
	connection.query(selectQuery, (err, results)=>{
		if(err) throw err;
		console.log(results);
		if(results.length == 0){
			var insertQuery = `INSERT INTO users(username, score) VALUES ('${username}', '${score}');`;
			connection.query(insertQuery, (err, results)=>{
				if (err) throw err;
				res.redirect('/?msg=userAdded');
			});
		}else { 
			var updateQuery = `UPDATE users SET score ='${score}' WHERE username = '${username}';`;
			connection.query(updateQuery, (err, results)=>{
				if(err) throw err;
				res.redirect('/?msg=scoreUpdated');
			});
		}
	});
});
module.exports = router;
