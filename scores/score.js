var mongoose = require('mongoose'),
	connection = mongoose.connection,
	Schema = mongoose.Schema;

var scoreSchema = new Schema({
	level: {
		type: Schema.Types.ObjectId,
		ref: 'Level',
		required: true,
		select: false
	},
	score: {
		type: Number,
		required: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	time: {
		type: Date,
		default: Date.now
	}
});

var Level = mongoose.model('Level');
scoreSchema.pre('save', function(next) {
	// this.model('Level').findById(this.level, function(err, level) {
	Level.findById(this.level, function(err, level) {
		if(err) next(err);
		
		if(level === null) {
			next(new Error('Level doesn\'t exist'));
		} else {
			next();
		}
	});
});

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;