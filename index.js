var express = require('express'),
	app = express(),
	highscores = require('./highscores.js');

var server = app.listen(8080);

console.log('Server on port 8080.')

app.use(express.static(__dirname + '/static'));
app.use('/scores/*', highscores.assureConnected());
app.use(require('body-parser').json());

app.get('/scores/all', function(req, res, next) {
	highscores.getAll(function(err, scores) {
		if(err) next(err);

		res.json(scores);
	});
});

app.get('/scores/high', function(req, res, next) {
	highscores.getTop(10, function(err, scores) {
		if(err) next(err);

		res.json(scores);
	});
});

app.post('/scores/add', function(req, res, next) {
	console.log(req.body);
	highscores.add(req.body, function(err, score) {
		if(err) next(err);

		res.json(score);
	});
});

app.post('/scores/remove', function(req, res, next) {
	highscores.remove(req.body, function(err, score) {
		if(err) next(err);
		
		res.json(score);
	});
});