var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	database = require('./database.js'),

	session = require('./session/'),
	user = require('./user/'),
	highscores = require('./highscores/'),
	levels = require('./levels/');

//Dont start until connected to mongodb
database.connect(function() {
	app.listen(8080, function() {
		console.log('Server up on port 8080.')
	});

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		next();
	})
	// app.use(express.static(__dirname + '/static'));
	app.use(express.static('static'));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(session());
	app.use('/user', user.router());
	app.use(user.authenticate());
	app.use('/levels', levels.router());
	app.use('/scores', highscores.router());
	
	app.use(function(req, res) {
		console.log(req.session.user ? 'Logged in as ' + req.session.user.username : 'Logged out');
		res.json(false);
	});
	app.use(function(err, req, res, next) {
		console.log('Error: %s', err);
		res.status(500);
		res.json('error ' + err);
	});
	
	// app.use('/levels', levels.router());
	// app.use('/scores', highscores.router());
	// app.get('/*', function(req, res, next) {
		// res.sendfile(__dirname + '/static/index.html');
	// });

});

