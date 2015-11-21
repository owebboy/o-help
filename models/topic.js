var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Topic = new Schema({
	topic: String,
	questions: Number,
	date: {
		created: Date
	}
});

module.exports = mongoose.model('topic', Topic);
