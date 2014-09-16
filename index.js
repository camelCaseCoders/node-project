var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	database = require('./database.js'),

	session = require('./session/'),
	user = require('./user/'),
	levels = require('./levels/'),
	scores = require('./scores/');

//Dont start until connected to mongodb
database.connect(function() {
	app.listen(8080, function() {
		console.log('Server up on port 8080.')
	});

	//Enable CORS
	app.use(function(req, res, next) {
	    res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		next();
	})
	// app.use(express.static(__dirname + '/static'));
	app.use(express.static('static'));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(session());
	app.use('/user', user.api());
	app.use(user.authenticate());
	app.use('/levels', levels.api());
	app.use('/scores', scores.api());
	//User debug
	app.use(function(req, res) {
		console.log(req.session.user ? 'Logged in as ' + req.session.user.username : 'Logged out');
		res.json(false);
	});
	//Error logging
	app.use(function(err, req, res, next) {
		console.log('Error: %s', err);
		res.status(500);
		res.json('error ' + err);
	});
});

