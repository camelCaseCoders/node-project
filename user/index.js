var express = require('express'),
	database = require('./database.js'),

	COOKIE_USERNAME = 'username',
	COOKIE_HASH = 'userhash';


module.exports.authenticate = function() {
	return function(req, res, next) {
		if(req.session && !req.session.user) {
			var username = req.cookies[COOKIE_USERNAME],
				hash = req.cookies[COOKIE_HASH];

			if(username && hash) {
				database.findUser({
					username: username,
					hash: hash
				},
				function(err, user) {
					if(err) next(err);

					if(user !== null) {
						req.session.user = user;
					} else {
						res.clearCookie(COOKIE_USERNAME);
						res.clearCookie(COOKIE_HASH);
					}
					next();
				})
			}
		} else {
			next();
		}
	}
}

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

			login(user, req, res);
		});
	});
	router.post('/login', function(req, res, next) {
		database.findUser({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) next(err);

			login(user, req, res);
		});
	});

	router.get('/logout', function(req, res, next) {
		delete req.session.user;

		res.clearCookie(COOKIE_USERNAME);
		res.clearCookie(COOKIE_HASH);

		res.send(true);
	});

	function login(user, req, res) {
		if(user === null) {
			return res.json(false);
		}

		req.session.user = user;

		res.cookie(COOKIE_USERNAME, user.username);
		res.cookie(COOKIE_HASH, user.hash);

		res.json(true);
	}

	return router;
}