var mongoose = require('mongoose'),
	connection = mongoose.connection;

connection.on('error', function() {
	console.log('Error connecting to MongoDB.');
});


module.exports.connect = function() {
	mongoose.connect('mongodb://localhost/');
}

module.exports.ensureConnected = function() {
	return function(req, res, next) {
		if(connection.readyState === 1) {
			next();
		} else {
			res.json(false);
		}	
	}
};

