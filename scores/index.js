var express = require('express'),
	Score = require('./score.js');

module.exports.api = function() {
	var router = express.Router();

	/*
	req.query:
		level
	*/
	router.get('/all', function(req, res, next) {
		Score.find({level: req.query.level})
			.select('owner score')
			.sort('-score')
			.populate('owner', 'username')
			.exec(function(err, scores) {
				if(err) next(err);

				res.json(scores);
			});
	});

	/*
	req.query:
		level
		from, length
		sort
	*/
	router.get('/interval', function(req, res, next) {
		Score.find({level: req.query.level})
			.select('-__v')
			.sort(req.query.sort)
			.skip(req.query.from)
			.limit(req.query.length)
			.populate('owner', 'username')
			.exec(function(err, scores) {
				if(err) next(err);

				res.json(scores);
			});
	});

	/*
	LOGGED IN
	req.body:
		level
		score
	*/
	router.post('/submit', function(req, res, next) {
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		var level = {
			score: req.body.score,
			owner: user._id
		};

		if(req.body.level) {
			level.level = req.body.level;
		}

		Score.create(level, function(err, score) {
			if(err) next(err);

			res.json(score);
		});
	});

	/*
	LOGGED IN
	req.body:
		id
	*/
	router.delete('/byid', function(req, res, next) {
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		Score.findById(req.body.id)
			.where('owner', user._id)
			.remove(function(err, score) {
				if(err) next(err);

				res.json(score !== null);
			});
	});

	return router;
}

