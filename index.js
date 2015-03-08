var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),

	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	database = require('./database.js'),

	session = require('./session/'),
	user = require('./user/'),
	levels = require('./levels/'),
	scores = require('./scores/'),

	error = require('./error.js'),

	socket = require('./socket/');

//Dont start until connected to mongodb
database.connect(function() {
	server.listen(8080, function() {
		console.log('Server up on port 8080.')
	});

	socket(io);

	//Enable CORS
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Requested-With');

		if (req.method != 'OPTIONS') return next();

   		res.status(204).end();
   	});
	// app.use(express.static(__dirname + '/static'));
	app.use(express.static('static'));
	app.use(bodyParser.json());
	app.use(cookieParser());

	app.use(function(req, res, next) {
		console.log(req.method, req.url)
		next();
	})

	// app.use(session());
	app.use(user.authenticate());
	app.use('/user', user.api());
	app.use('/level', levels.api());
	app.use('/scores', scores.api());
	//User debug
	app.use(function(req, res, next) {
		// console.log(req.user ? 'Logged in as ' + req.user.username : 'Logged out');
		// res.json(false);

		next();
	});
	//Error logging
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		
		console.log(err);
		res.json(err);
	});
});

