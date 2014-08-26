var express = require('express'),
	database = require('./database.js');
	
module.exports.router = function() {
	var router = express.Router();

	router.post('/register', function(req, res, next) {
		database.register({
			username: req.body.username,
			hash: req.body.hash
		
		}, function(err, user) {
			if(err) next(err);

			attemptLogin(user, res);
		});
	});
	router.post('/login', function(req, res, next) {
		database.login({
			username: req.body.username,
			hash: req.body.hash

		}, function(err, user) {
			if(err) next(err);

			attemptLogin(user, res);
		});
	});

	router.post('/logout', function(req, res, next) {
		res.clearCookie('userId');
		res.clearCookie('userHash');
		res.send(true);
	});

	function attemptLogin(user, res) {
		if(user === null) res.json(false);

		res.cookie('userId', user._id);
		res.cookie('userHash', user.hash);

		res.json(true);
	}

	return router;
}

module.exports.authenticate = function() {
	return function(req, res, next) {
		var id = req.cookies.userId, hash = req.cookies.userHash;
		if(id && hash) {
			database.authenticate(id, hash, function(err, user) {
				if(err) next(err);

				console.log(user);
				if(user !== null) {
					req.user = user;
				}
				next();
			});
		} else {
			next();
		}
	}
}