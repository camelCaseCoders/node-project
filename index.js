var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	// io = require('socket.io')(server),

	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	database = require('./database.js'),

	cors = require('./cors/'),

	// session = require('./session/'),
	user = require('./user/'),
	levels = require('./levels/'),
	scores = require('./scores/'),

	error = require('./error.js')
	// ,socket = require('./socket/')
	;

//Dont start until connected to mongodb
database.connect(function() {
	server.listen(8080, function() {
		console.log('Server up on port 8080.')
	});

	// socket(io);

	//Enable CORS
	app.use(cors());
	// app.use(express.static('static'));
	app.use(bodyParser.json());
	app.use(cookieParser());

	//Log method and url
	app.use(function(req, res, next) {
		console.log(req.method, req.url)
		next();
	})

	// app.use(session());
	
	//Authenticate first
	app.use(user.authenticate());
	//Expose API
	app.use('/user', user.api());
	app.use('/level', levels.api());
	app.use('/scores', scores.api());

	//Error logging
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		
		console.log(err);
		res.json(err);
	});
});

