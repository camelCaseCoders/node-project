var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('../user/user.js');
	error = require('../error.js');

var ratingValidator = [function(value) {
	console.log('validating:', value);
	return Math.floor(value) === value;
}, 'Invalid rating'];

var schema = new Schema({
	title: {
		type: String,
		required: true
	},
	grid: [Number],
	ratings: [{
		by: {
			type: Schema.Types.ObjectId,
			select: false
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			validate: ratingValidator
		}
	}],
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	scores: [{
		type: Schema.Types.ObjectId,
		ref: 'Score',
		select: false
	}],
	time: {
		type: Date,
		default: Date.now
	}
});

var Level = mongoose.model('Level', schema);

schema.path('grid').validate(function(value) {
	return this.grid && this.grid.length > 0;

}, 'Invalid grid');

function bind(io) {

	schema.path()

	schema.pre('save', function (next) {
	    this.wasNew = this.isNew;
	    console.log(this.__proto__);
		next();
	});

	schema.post('save', function(level) {
		console.log(level);
		console.log(level.__proto__);
		if(level.wasNew) {
			User.findById(level.creator).select('username')
				.exec(function(err, user) {
					io.sockets.emit('level:add', {
						_id: level.id,
						title: level.title,
						time: level.time,
						grid: level.grid,
						creator: user
					});
				})
		} else {
			io.sockets.emit('level:change', level);
		} 
	});
	schema.post('remove', function(level) {
		io.sockets.emit('level:remove', level._id);
	});

}


module.exports = {
	Level: Level,
	bind: bind
};