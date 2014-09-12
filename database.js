var mongoose = require('mongoose'),
	connection = mongoose.connection;

module.exports.connect = function(callback) {
	mongoose.connect('mongodb://localhost/');
	connection.once('open', function() {
		callback();
	});
	connection.on('error', function() {
		console.log('Error connecting to MongoDB.');
	});
}

// module.exports.ensureConnected = function() {
// 	return function(req, res, next) {
// 		if(connection.readyState === 1) {
// 			next();
// 		} else {
// 			res.json(false);
// 		}	
// 	}
// };

