var express = require('express'),
	Level = require('./level.js'),
	error = require('../error.js');

module.exports.api = function() {

	var router = express.Router();

	/*
		req.query:
			sort
	*/
	router.get('/all', function(req, res, next) {
		Level.find()
			.select('grid creator time title ratings rating')
			.populate('creator', 'username')
			.populate('ratings.by', 'username')
			.sort(req.query.sort)
			.exec(function(err, levels) {
				if(err) next(err);

				res.json(levels);
			});
	});

	/*
	*/
	router.get('/removeall', function(req, res, next) {
		Level.remove(function(err, effect) {
			if(err) return next(err);
		})
	});
	
	/*
		req.query:
			from, length
			sort
	*/
	router.get('/interval', function(req, res, next) {
		Level.find()
			.select('grid creator time title')
			.sort(req.query.sort)
			.skip(req.query.from)
			.limit(req.query.length)
			.populate('creator', 'username')
			.exec(function(err, levels) {
				if(err) return next(err);

				res.json(levels);
			});
	});
	/*
		req.query:
			id
	*/
	router.get('/bycreator', function(req, res, next) {
		Level.findOne({creator: req.query.id})
			.select('grid creator time title')
			.exec(function(err, levels) {
				if(err) return next(err);

				res.json(levels);
			});
	});
	/*
		LOGGED IN
	*/
	router.get('/my', function(req, res, next) {
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		Level.find({creator: user})
			.select('grid time title rating')
			.exec(function(err, levels) {
				if(err) return next(err);

				res.json(levels);
			});
	});
	/*
		req.query:
			id
	*/
	router.get('/byid', function(req, res, next) {
		Level.findById(req.query.id)
			.select('grid creator time title')
			.exec(function(err, level) {
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
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		Level.create({
			title: req.body.title,
			grid: req.body.grid,
			creator: user._id
		},
		function(err, level) {
			if(err) return next(err);	

			res.json(true);
		});
	});
	/*
		LOGGED IN
		req.body:
			id (for level)
	*/
	router.delete('/byid', function(req, res, next) {
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		Level.remove({creator: user._id, _id: req.body.id}, function(err, effect) {
			if(err) return next(err);
			
			res.json(effect);
		});
	});
	/*
		LOGGED IN
		req.body:
			id (for level)
			rating
	*/
	var rateError = new error.UserError('Invalid rate');
	router.post('/rate', function(req, res, next) {
		var user = req.user;
		if(!user) return next(error.notLoggedInError);

		var id = req.body.id, rating = req.body.rating;

		if(!id || !rating) return next(rateError);

		Level.rate(id, user._id, +rating, function(err) {
			if(err) return next(err);

			res.json(true);
		});
	});



	return router;
};