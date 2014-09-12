var express = require('express'),
	database = require('./database.js');

module.exports.router = function() {
	var router = express.Router();

	//sort by: -likes, time
	//from to
	router.get('/interval', function(req, res, next) {
		database.interval(req.body.sortBy, req.body.from, req.body.length, function(err, levels) {
			if(err) next(err);

			res.json(levels);
		});
	});
	router.get('/bycreator', function(req, res, next) {
		database.bycreator(req.body.user, function(err, levels) {
			if(err) next(err);

			res.json(levels);
		});
	});
	router.get('/fromid', function(req, res, next) {
		database.fromid(req.body.id, function(err, level) {
			if(err) next(err);

			res.json(level);
		});
	});

	router.post('/submit', function(req, res, next) {
		if(!req.session.user) {
			next('Tried to submit level without user');
		}

		database.submit({
			title: req.body.title,
			grid: req.body.grid,
			creator: req.session.user._id
		},
		function(err, level) {
			if(err) next(err);

			res.json(level);
		})
	});
	router.post('/remove', function(req, res, next) {
		if(!req.session.user) {
			next('Tried to remove level without user');
		}

		database.fromid(req.body.id, function(err, level) {
			if(err) next(err);

			if(level.owner === req.session.user._id) {
				database.remove(level, function(err, level) {
					if(err) next(err);

					res.json(level !== null);
				});

			} else {
				next('Not owner of level');
			}
		});
	});
	router.post('/like', function(req, res, next) {
		if(!req.session.user) {
			next('Tried to like level without user');
		}

		database.fromid(req.body.id, function(err, level) {
			if(err) next(err);

			var index = level.likes.indexOf(req.session.user._id),
				like = index === -1;

			if(like) {
				level.likes.push(req.session.user._id);
			} else {
				
			}


			database.like(level, like, function(err, level) {
				if(err) next(err);

				res.json(like);
			});
		});

	});

	return router;
}