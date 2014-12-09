var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	error = require('../error.js');

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
userSchema.pre('save', function(next) {
	User.findOne({username: this.username}, function(err, user) {
		if(user === null) {
			next();
		} else {
			next(new error.UserError('User already exists'));
		}
	});
});


module.exports = User;