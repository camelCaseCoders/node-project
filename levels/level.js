var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = require('mongoose').Types.ObjectId,
	User = require('../user/user.js');
	error = require('../error.js'),
	async = require('async');

var ratingValidator = [function(value) {
	//Integer in interval [1,5]
	return value > 0 && value < 6 && Math.floor(value) === value;

}, 'Invalid rating'];

var gridValidator = [function(value) {
	return this.grid && this.grid.length > 0;

}, 'Invalid grid'];

var rating = new Schema({
	by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	rating: {
		type: Number,
		validate: ratingValidator
	}
});

var schema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	grid: {
		type: [Number],
		validate: gridValidator
	},
	rating: {
		type: Number,
		required: false,
		default: 0
	},
	ratings: {
		type: [rating],
		select: false
	},
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

//TODO ta bort en level ska ta bort deras scores
schema.post('remove', function(level) {
	this.model('Score').remove({level: level._id});	
})

schema.statics.rate = function(id, userId, rating, callback) {
	//Validate rating
	if(!ratingValidator[0](rating)) {
		return callback(new error.ValidationError(ratingValidator[1]));
	}

	async.parallel([
		function(callback) {
			Level.update(
				{_id: id, 'ratings.by': userId},
				{$set: {'ratings.$.rating': rating}},
				callback);
		},
		function(callback) {
			Level.update(
				{_id: id, 'ratings.by': {$ne: userId}},
				{$push: {ratings: {by: userId, rating: rating}}},
				callback);
		}
	], function(err, effect) {
		if(!effect) {
			return callback(err);
		}

		// P(r, n) = r + 1 - 1/(n^k + 1)
		Level.aggregate([
			{$match: {_id: new ObjectId(id)}},
			{$unwind: '$ratings'},
			{$group: {_id: null, rating: {$avg: '$ratings.rating'}}},
			{$project: {_id: 0, rating: 1}}
		], function(err, result) {
			if(err) return callback(err);

			Level.update(
				{_id: id},
				{$set: {rating: result[0].rating}},
			function(err, result) {
				if(err) return callback(err);

				callback(null);
			});
		});
	})
};

var Level = mongoose.model('Level', schema);

module.exports = Level;