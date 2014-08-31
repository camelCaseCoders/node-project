var express = require('express'),
	database = require('./database.js'),
	session = require('./session.js'),

	COOKIE_USERNAME = 'username',
	COOKIE_HASH = 'userhash';
	
module.exports.router = function() {
	var router = express.Router();

	router.get('/getall', function(req, res, next) {
		database.findAll(function(err, users) {
			res.json(users);
		});
	});
	router.get('/removeall', function(req, res, next) {
		database.removeAll(function(err, users) {
			res.json(users);
		});
	});

	router.post('/register', function(req, res, next) {
		database.registerUser({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) next(err);

			login(user, res);
		});
	});
	router.post('/login', function(req, res, next) {
		database.findUser({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) next(err);

			login(user, res);
		});
	});

	router.get('/logout', function(req, res, next) {
		res.clearCookie(COOKIE_USERNAME);
		res.clearCookie(COOKIE_HASH);
		session.remove(req, res);

		res.send(true);
	});

	function login(user, res) {
		if(user === null) return res.json(false);

		res.cookie(COOKIE_USERNAME, user.username);
		res.cookie(COOKIE_HASH, user.hash);
		session.create(res, user);

		res.json(true);
	}

	return router;
}

module.exports.session = session.middleware;