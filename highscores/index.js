var express = require('express'),
	database = require('./database.js');

module.exports.router = function() {
	var router = express.Router();
	
	router.get('/all', function(req, res, next) {
		database.getAll(function(err, scores) {
			if(err) next(err);

			res.json(scores);
		});
	});

	router.get('/high', function(req, res, next) {
		database.getTop(10, function(err, scores) {
			if(err) next(err);

			res.json(scores);
		});
	});

	router.post('/add', function(req, res, next) {
		var user = req.session.user;
		if(!user) next('No user in add score');

		database.add({
			score: req.body.score,
			time: Date.now(),
			username: user.username
		},
		function(err, score) {
			if(err) next(err);

			res.json(score);
		});
	});

	router.post('/remove', function(req, res, next) {
		var user = req.session.user;
		if(!user) next('No user in remove score');

		database.find(req.body.id, function(err, score) {
			if(score !== null) {
				if(score.username === req.user.username) {
					database.remove(score, function(err) {
						if(err) next(err);
						else res.json(true);
					});
				} else {
					next('Didnt own score');
				}
			} else {
				res.json(false);
			}
		})
	});

	return router;
}

