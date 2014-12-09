var express = require('express'),
	User = require('./user.js'),

	config = require('../config.json'),
	COOKIE_USERNAME = config.usernameCookie,
	COOKIE_HASH = config.userhashCookie;


module.exports.authenticate = function() {
	return function(req, res, next) {
		var username = req.cookies[COOKIE_USERNAME],
				hash = req.cookies[COOKIE_HASH];

		if(!req.session.user && username && hash) {
			User.findOne({
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
			//Prevent next from getting called before database request has finished
			return;
		}
		next();
	}
};

module.exports.api = function() {
	var router = express.Router();

	router.get('/all', function(req, res, next) {
		User.find({}, '-__v', function(err, users) {
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

	//
	router.get('/me', function(req, res, next) {
		var user = req.session.user;
		if(user) {
			sendUser(user, res);
		} else {
			res.send(false);
		}
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

		sendUser(user, res);
	}

	function sendUser(user, res) {
		res.json({
			username: user.username,
			id: user._id
		});
	}

	return router;
};