var express = require('express'),
	Level = require('./level.js'),
	error = require('../error.js');

module.exports.api = function() {
	var router = express.Router();

	/*
	*/
	router.get('/all', function(req, res, next) {
		Level.find()
			.populate('creator', 'username')
			.exec(function(err, levels) {
				if(err) next(err);

				res.json(levels);
			});
	});
	
	/*
		req.body:
			from, length
			sort
	*/
	router.get('/interval', function(req, res, next) {
		Level.find()
			.sort(req.body.sort)
			.skip(req.body.from)
			.limit(req.body.length)
			.populate('creator', 'username')
			.exec(function(err, levels) {
				if(err) return next(err);

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
			.exec(function(err, levels) {
				if(err) return next(err);

				res.json(levels);
			});
	});
	/*
	*/
	router.get('/my', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		Level.find({
				creator: user
			})
			.exec(function(err, levels) {
				if(err) return next(err);

				res.json(levels);
			});
	});
	/*
		req.body:
			id
	*/
	router.get('/byid', function(req, res, next) {
		Level.findById(req.body.id, function(err, level) {
			if(err) return next(err);

			res.json(level);
		});
	});

	/*
		LOGGED IN
		req.body:
			title
			grid
	*/
	var submitError = new error.UserError('Incorrect level submited');
	router.post('/submit', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		Level.create({
			title: req.body.title,
			grid: req.body.grid,
			creator: user._id
		},
		function(err, level) {
			if(err) {
				next(err instanceof error.UserError ? err : submitError);	
			} else {
				res.json(level);
			}
		});
	});
	/*
		LOGGED IN
		req.body:
			id
	*/
	router.delete('/byid', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		Level.findById(req.body.id)
			//Make sure user owns it
			.where('creator').equals(user._id)
			.remove(function(err, level) {
				if(err) return next(err);

				res.json(!!level);
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