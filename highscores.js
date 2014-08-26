var mongoose = require('mongoose'),
	connection = mongoose.connection,
	Schema = mongoose.Schema;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
	var scoreSchema = new Schema({
		score: {type: Number, default: 0},
		username: {type: String, default: 'Anonymous'},
		time: Date
	});

	var Score = mongoose.model('Score', scoreSchema);

	module.exports.add = function(score, callback) {
		Score.create(score, callback);
	}
	module.exports.remove = function(score, callback) {
		Score.remove(score, callback);
	}
	module.exports.getAll = function(callback) {
		Score.find().sort('-score').exec(callback);
	}
	module.exports.getTop = function(top, callback) {
		Score.find().sort('-score').limit(top).exec(callback);
	}
});

mongoose.connect('mongodb://localhost/highscores');

module.exports.assureConnected = function() {
	return function(req, res, next) {
		if(connection.readyState === 1) {
			next();
		} else {
			res.json(false);
		}	
	}
};