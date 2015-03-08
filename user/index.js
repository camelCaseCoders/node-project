var express = require('express'),
	User = require('./user.js'),

	config = require('../config.json'),
	COOKIE_USERNAME = config.usernameCookie,
	COOKIE_HASH = config.userhashCookie;


module.exports.authenticate = function() {
	return function(req, res, next) {
		var username = req.cookies[COOKIE_USERNAME],
				hash = req.cookies[COOKIE_HASH];

		var start = Date.now();

		if(username && hash) {
			User.findOne({
				username: username,
				hash: hash
			},
			function(err, user) {
				if(err) next(err);

				if(user) {
					req.user = user;
				} else {
					res.clearCookie(COOKIE_USERNAME);
					res.clearCookie(COOKIE_HASH);
				}
				// console.log('fetching user took', Date.now() - start)
				next();
			})
		} else {
			next();
		}
	}
};

module.exports.api = function(io) {
	var router = express.Router();

	router.get('/all', function(req, res, next) {
		User.find(function(err, users) {
			res.json(users);
		});
	});
	router.get('/removeall', function(req, res, next) {
		User.remove(function(err, users) {
			res.json(users);
		});
	});

	/*
		req.body:
			username
			hash
	*/
	router.post('/register', function(req, res, next) {
		User.create({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) return next(err);

			login(user, req, res);
		});
	});

	/*
		req.body:
			username
			hash
	*/
	router.post('/login', function(req, res, next) {
		User.findOne({
			username: req.body.username,
			hash: req.body.hash
		},
		function(err, user) {
			if(err) return next(err);

			login(user, req, res);
		});
	});

	router.get('/me', function(req, res, next) {
		var user = req.user;
		if(user) {
			sendUser(user, res);
		} else {
			res.send(false);
		}
	});

	router.get('/logout', function(req, res, next) {
		delete req.user;

		res.clearCookie(COOKIE_USERNAME);
		res.clearCookie(COOKIE_HASH);

		res.send(true);
	});

	function login(user, req, res) {
		if(user === null) {
			return res.json(false);
		}

		req.user = user;

		res.cookie(COOKIE_USERNAME, user.username);
		res.cookie(COOKIE_HASH, user.hash);

		sendUser(user, res);
	}

	function sendUser(user, res) {
		res.json({
			username: user.username
		});
	}

	return router;
};