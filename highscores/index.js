var express = require('express'),
	database = require('./database.js');

module.exports.router = function() {
	var router = express.Router();
	
	router.get('/all', function(req, res, next) {
		console.log('YES');
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
		database.add(req.body, function(err, score) {
			if(err) next(err);

			res.json(score);
		});
	});

	router.post('/remove', function(req, res, next) {
		console.log(req.body);
		database.remove(req.body.id, function(err, score) {
			if(err) next(err);
			
			res.json(true);
		});
	});

	return router;
}

