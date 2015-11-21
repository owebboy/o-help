var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Topic = require('../models/topic');
var Account = require('../models/account');
var Question = require('../models/question');

router.get('/:user', function (req, res) {
	Account.findOne({ username: req.params.user }, function (err, user) {
		if (err) throw err;	
		Question.find({ 'question.user.id': user.id }, function (err, result) {
			if (err) throw err;	
			res.render('profile', { 
				user : req.user,
				account: user, 
				title: user.username, 
				question: result
			});	
		}); 
	});
});

module.exports = router;
