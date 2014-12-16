var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('../user/user.js');
	error = require('../error.js');

var schema = new Schema({
	title: {
		type: String,
		required: true
	},
	grid: [Number],
	likes: [{
		type: Schema.Types.ObjectId
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

var gridError = new error.UserError('Invalid grid');
schema.pre('save', function(next) {
	if(this.grid && this.grid.length > 0) {
		next();
	} else {
		next(gridError);
	}
});

function bind(io) {

	schema.post('save', function(level) {
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
	});
	schema.post('remove', function(level) {
		io.sockets.emit('level:remove', level._id);
	});

}


module.exports = {
	Level: Level,
	bind: bind
};