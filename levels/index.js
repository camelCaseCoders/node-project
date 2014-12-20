var express = require('express'),
	level = require('./level.js'),
	Level = level.Level,
	ObjectId = require('mongoose').Types.ObjectId,
	async = require('async'),
	error = require('../error.js');

module.exports.api = function(io) {

	level.bind(io);

	var router = express.Router();

	/*
	*/
	router.get('/all', function(req, res, next) {
		Level.find()
			.select('grid creator time title ratings popularity')
			.populate('creator', 'username')
			.populate('ratings.by', 'username')
			.sort('-popularity')
			.exec(function(err, levels) {
				if(err) next(err);

				res.json(levels);
			});
	});

	/*
	*/
	router.get('/removeall', function(req, res, next) {
		Level.find()
			.exec(function(err, levels) {
				if(err) next(err);
				levels.forEach(function(level) {
					level.remove();
				});
				res.json(levels);
			});
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
		Level.find({
				creator: req.query.id
			})
			.select('grid creator time title')
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
			.select('grid creator time title')
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
		var user = req.session.user;
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
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		Level.findById(req.body.id)
			//Make sure user owns it
			.where('creator').equals(user._id)
			.exec(function(err, level) {
				if(err) return next(err);

				if(level) {
					level.remove();
				}
				return res.json(!!level);
			})
	});
	/*
		LOGGED IN
		req.body:
			id (for level)
			rating
	*/
	var rateError = new error.UserError('Invalid rate');
	router.post('/rate', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		var id = req.body.id, rating = req.body.rating;

		if(!id || !rating) return next(rateError);

		// var start = Date.now();
		async.parallel([
			function(callback) {
				Level.update(
					{_id: id, 'ratings.by': user._id},
					{$set: {'ratings.$.rating': rating}},
					callback);
			},
			function(callback) {
				Level.update(
					{_id: id, 'ratings.by': {$ne: user._id}},
					{$push: {ratings: {by: user._id, rating: rating}}},
					callback);
			}
		], function(err, a) {
			if(err) return next(err);

			// var add = Date.now();
			// console.log('Adding rating took', add - start);

			res.json(true);

			Level.aggregate([
				{$match: {_id: new ObjectId(id)}},
				{$unwind: '$ratings'},
				{$group: {_id: null, popularity: {$avg: '$ratings.rating'}}},
				{$project: {_id: 0, popularity: 1}}
			], function(err, result) {
				if(err) next(err);

				// var agg = Date.now();
				// console.log('Aggregation took', agg - add);
				var popularity = result[0].popularity;

				console.log(popularity);

				Level.update(
					{_id: id},
					{$set: {popularity: popularity}},
				function(err, result) {
					if(err) return next(err);

					// console.log('Update took', Date.now() - agg);
					// console.log('Total time', Date.now() - start);

					console.log(result);
				});
			});
		})
	});



	return router;
};