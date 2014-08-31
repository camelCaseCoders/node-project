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
	User.findOne(user, function(err, foundUser) {
		//No such user exists
		if(foundUser === null) {
			console.log('create user');
			User.create(user, callback);
		} else {
			console.log('return foundUser');
			callback(err, foundUser);
		}
	});
}






// module.exports.login = function(user, callback) {
// 	User.findOne({username: user.username}, function(err, foundUser) {
// 		if(foundUser === null || foundUser.hash !== user.hash) {
// 			callback(err, null);
// 		} else {
// 			console.log(user);
// 		}
// 	});
// }






// module.exports.register = function(user, callback) {
// 	User.findOne({username: user.username}, function(err, foundUser) {
// 		//No such user exists
// 		if(foundUser === null) {
// 			User.create(user, callback);
// 		} else {
// 			callback(err, null);
// 		}
// 	});
// }


// module.exports.authenticate = function(id, hash, callback) {
// 	User.findById(id, function(err, user) {
// 		if(user === null || user.hash !== hash) {
// 			callback(err, null);
// 		} else {
// 			callback(err, user);
// 		}
// 	});
// }

