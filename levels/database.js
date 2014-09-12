var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var levelSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	grid: [{
		type: String,
		trim: true,
		validate: /^([\da-f]{3}|[\da-f]{6})$/i,
		default: 'fff'
	}],
	likes: [{
		type: Schema.Types.ObjectId
	}],
	creator: {
		type: Schema.Types.ObjectId,
		required: true
	},
	time: {
		type: Date,
		default: Date.now
	}
});

var Level = mongoose.model('Level', levelSchema);

module.exports.interval = function(sort, from, length, callback) {
	Level.find().sort(sort).skip(from).limit(length).exec(callback);
}

module.exports.bycreator = function(id, callback) {
	Level.find({creator: id}).exec(callback);
}

module.exports.fromid = function(id, callback) {
	Level.findById(id).exec(callback);
}


module.exports.submit = function(level, callback) {
	Level.create(level, callback);
}

module.exports.remove = function(level, callback) {
	Level.findByIdAndRemove(level, callback);
}


module.exports.like = function(level, likes, callback) {
	Level.findByIdAndUpdate(id, {$set: {likes: likes}});
}

// var User = 

// module.exports.findUser = function(user, callback) {
// 	User.findOne(user, callback);
// }

// module.exports.registerUser = function(user, callback) {
// 	User.findOne({username: user.username}, function(err, foundUser) {
// 		//No such user exists
// 		if(foundUser === null) {
// 			console.log('create user');
// 			User.create(user, callback);
// 		} else {
// 			console.log('user already exists');
// 			callback(err, null);
// 		}
// 	});
// }
// module.exports.findAll = function(callback) {
// 	User.find(callback);
// }
// module.exports.removeAll = function(callback) {
// 	User.remove(callback);
// }