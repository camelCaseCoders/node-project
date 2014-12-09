var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	error = require('../error.js');

var levelSchema = new Schema({
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

var Level = mongoose.model('Level', levelSchema);

var gridError = new error.UserError('Invalid grid');
levelSchema.pre('save', function(next) {
	if(this.grid && this.grid.length > 0) {
		next();
	} else {
		next(gridError);
	}
});

module.exports = Level;