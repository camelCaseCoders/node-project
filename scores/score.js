var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	error = require('../error.js');

var scoreSchema = new Schema({
	level: {
		type: Schema.Types.ObjectId,
		ref: 'Level',
		select: false
	},
	score: {
		type: Number,
		required: true,
		//Max is the theroretical maximum (width * height * scorePerBug)
		min: 1, max: 75000
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

var noLevelError = new error.UserError('Level does not exist'); 
scoreSchema.pre('save', function(next) {
	// this.model('Level').findById(this.level, function(err, level) {

	if(!this.level) {
		return next();
	}

	Level.findById(this.level, function(err, level) {
		if(err) next(err);
		
		if(level === null) {
			next(noLevelError);
		} else {
			next();
		}
	});
});

var Score = mongoose.model('Score', scoreSchema);

module.exports = Score;