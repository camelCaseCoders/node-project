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
	scores: {
		type: Schema.Types.ObjectId,
		ref: 'Score',
		select: false
	},
	time: {
		type: Date,
		default: Date.now
	}
});

var Level = mongoose.model('Level', levelSchema);

module.exports = Level;