var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Question = new Schema({
	topic: String,
	answered: Boolean,
	question: {
		user: {
			id: String,
			username: String
		},
		content: String,
		date: {
			created: Date
		}
	},
	answers: [{
		user: {
			id: String,
			username: String
		},
		answer: String,
		description: String,
		correct: Boolean,
	}]
});

module.exports = mongoose.model('question', Question);
