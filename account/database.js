var mongoose = require('mongoose'),
	connection = mongoose.connection,
	Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	hash: {
		type: String,
		required: true,
		trim: true
	}
});

var User = mongoose.model('User', userSchema);

module.exports.findUser = function(user, callback) {
	User.findOne(user, callback);
}

module.exports.registerUser = function(user, callback) {
	User.findOne({username: user.username}, function(err, foundUser) {
		//No such user exists
		if(foundUser === null) {
			console.log('create user');
			User.create(user, callback);
		} else {
			console.log('user already exists');
			callback(err, null);
		}
	});
}
module.exports.findAll = function(callback) {
	User.find(callback);
}
module.exports.removeAll = function(callback) {
	User.remove(callback);
}