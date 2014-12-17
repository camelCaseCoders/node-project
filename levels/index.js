var express = require('express'),
	level = require('./level.js'),
	Level = level.Level,
	error = require('../error.js');

module.exports.api = function(io) {

	level.bind(io);

	var router = express.Router();

	/*
	*/
	router.get('/all', function(req, res, next) {
		Level.find()
			.select('grid creator time title ratings')
			.populate('creator', 'username')
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
	router.post('/rate', function(req, res, next) {
		var user = req.session.user;
		if(!user) return next(error.notLoggedInError);

		var rating = req.body.rating;
		Level.findById(req.body.id)
			.where('')


// db.books.update(
//    { item: "ZZZ135" },
//    {
//      item: "ZZZ135",
//      stock: 5,
//      tags: [ "database" ]
//    },
//    { upsert: true }
// )

		// Rating.update(
		// 	{level: req.body.id, by: user.id},
		// 	{level: user.id, by: user.id, rating: req.body.rating},
		// 	{upsert: true})

		// Rating.aggregate([
		// 	{$match: {level: level._id}},
		// 	{group: {_id: null, avg: {$avg, '$rating'}}}
		// ])


		Level.update({_id: req.body.id},
			{$addToSet: {
				ratings: {by: user.id, rating: rating}
			}
		}, function(err, level) {
			if(err) return next(err);
			res.json(level);
		})
		// Level.findById(req.body.id)
		// 	.select('ratings')
		// 	.exec(function(err, level) {
		// 		if(err) return next(err);

		// 		if(level) {
		// 			var rated = false;
		// 			var ratings = level.ratings;
		// 			for(var i = 0; i < ratings.length; i++) {
		// 				if(ratings[i].by === user.id) {
		// 					ratings[i].rating = rating;
		// 					rated = true;
		// 					break;
		// 				}
		// 			}

		// 			if(!rated) {
		// 				ratings.push({
		// 					by: user.id,
		// 					rating: rating
		// 				});
		// 			}

		// 			level.markModified('ratings');
		// 			level.save();

		// 			res.json(true);
		// 		} else {
		// 			next(error.NotFound);
		// 		}
		// 	});
	});



	return router;
};