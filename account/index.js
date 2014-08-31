var express = require('express'),
	database = require('./database.js'),
	session = require('./session.js'),

	COOKIE_USERNAME = 'username',
	COOKIE_HASH = 'userhash';
	
module.exports.router = function() {
	var router = express.Router();

	router.post('/register', function(req, res, next) {
		console.log('/user');
		database.registerUser({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) next(err);

			console.log('login with user: ' + JSON.stringify(user));

			login(user, res);
		});
	});
	router.post('/login', function(req, res, next) {
		database.findUser({
			username: req.body.username,
			hash: req.body.hash

		}, function(err, user) {
			if(err) next(err);

			login(user, res);
		});
	});

	router.post('/logout', function(req, res, next) {
		res.clearCookie(COOKIE_USERNAME);
		res.clearCookie(COOKIE_HASH);
		session.remove(req, res);

		res.send(true);
	});

	function login(user, res) {
		if(user === null) res.json(false);

		res.cookie(COOKIE_USERNAME, user.username);
		res.cookie(COOKIE_HASH, user.hash);
		session.create(res, user);

		res.json(true);
	}

	return router;
}

module.exports.session = session.middleware;