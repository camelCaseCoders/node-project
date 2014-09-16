var mongoose = require('mongoose'),
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
userSchema.pre('init', function(next) {
	User.findOne({username: this.username}, function(err, user) {
		if(user === null) {
			next();
		} else {
			next(new Error('User already exists'));
		}
	});
});


module.exports = User;