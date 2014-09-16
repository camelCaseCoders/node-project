var express = require('express'),
	Level = require('./level.js');

module.exports.api = function() {
	var router = express.Router();
	/*
		req.query:
			from, length
			sort
	*/
	router.get('/interval', function(req, res, next) {
		console.log(req.query);
		Level.find()
			.sort(req.query.sort)
			.skip(freq.query.from)
			.limit(req.query.length)
			.exec(function(err, levels) {
				if(err) next(err);

				res.json(levels);
			});
	});
	/*
		req.body:
			id
	*/
	router.get('/bycreator', function(req, res, next) {
		Level.find({
				creator: req.body.id
			})
			.exec(function(err, level) {
				if(err) next(err);

				res.json(levels);
			});
	});
	/*
		req.body:
			id
	*/
	router.get('/byid', function(req, res, next) {
		Level.findById(req.body.id, function(err, level) {
			if(err) next(err);

			res.json(level);
		});
	});

	/*
		LOGGED IN
		req.body:
			title
			grid
	*/
	router.post('/submit', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next('Tried to submit level without user');

		Level.create({
			title: req.body.title,
			grid: req.body.grid,
			creator: user._id
		},
		function(err, level) {
			if(err) next(err);

			res.json(level);
		});
	});
	/*
		LOGGED IN
		req.body:
			id
	*/
	router.post('/remove', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next('Tried to remove level without user');

		Level.findById(req.body.id)
			//Make sure user owns it
			.where('creator').equals(user._id)
			.remove(function(err, level) {
				if(err) next(err);

				res.json(level !== null);
			})
	});


	// router.post('/like', function(req, res, next) {
	// 	if(!req.session.user) {
	// 		next('Tried to like level without user');
	// 	}

	// 	levels.findById(req.body.id, function(err, level) {
	// 		if(err) next(err);

	// 		if(level === null) {
	// 			return next('No such level');
	// 		}

	// 		var index = level.likes.indexOf(req.session.user._id),
	// 			like = index === -1;

	// 		if(like) {
	// 			level.likes.push(req.session.user._id);
	// 		} else {
	// 			level.likes.splice(index, 1);
	// 		}
	// 		level.markModified('likes');
	// 		level.save();

	// 		res.json(like);
	// 	});

	// });

	return router;
};