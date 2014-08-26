var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),

	database = require('./database.js'),

	account = require('./account/'),
	highscores = require('./highscores/');

var server = app.listen(8080, function() {
	console.log('Server up on port 8080.')
});

database.connect();

app.use(database.ensureConnected())
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(account.authenticate())
app.use('/account', account.router())
app.use('/scores', highscores.router());
app.get('/*', function(req, res, next) {
	 res.sendfile(__dirname + '/static/index.html');
});