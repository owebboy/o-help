var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Question = require('../models/question');
var Topic = require('../models/topic');
var Account = require('../models/account');

router.post('/new', isLoggedIn, function (req, res) {
	var content = req.body.content;
	var f;
	
	if (content.match(/\?$/)) {
		f = content
	} else {
		f = content + '?'
	}
	
	Question.create({
		answered: false,
		topic: req.body.topic,
		question: {
			user: {
				id: req.user.id,
				username: req.user.username
			},
			content: f,
			date: {
				created: new Date
			}
		}
	}, function(err, result) {
		if (err) throw err;
		res.redirect('/question/view/' + result.id);
	});
});

router.get('/view/:id', function(req, res) {
	Question.findOne({ _id: req.params.id }, function (err, result) {
		if (err) throw err;
		Topic.findOne({ _id: result.topic }, function (err, topic) {
			if (err) throw err;
			res.render('question', {
				user : req.user, title: 'question: ' + result.question.content, active: 'home', question: result, topic: topic
			});
		});
	});
});

router.post('/answer/:id', isLoggedIn, function(req, res) {
	Question.findOneAndUpdate({ _id: req.params.id }, { 
		answered: true,
		$push: { 
			answers: { 
				user: {
					id: req.user.id,
					username: req.user.username
				}, 
				answer: req.body.content, 
				correct: false
			} 
		} 
	}, function(err, result) {
		if (err) throw err;
		res.redirect('/question/view/' + result.id);
	});
});

router.get('/answer/right/:answer/:id', isLoggedIn, function(req, res) {
	Question.findOne({ _id: req.params.id }, function(err, result) {
		if (err) throw err;
		result.answers.id(req.params.answer).correct = true;
		result.save(function (err) {
			if (err) throw err;
			res.redirect('/question/view/' + req.params.id);
		});
	});
});

router.get('/answer/wrong/:answer/:id', isLoggedIn, function(req, res) {
	Question.findOne({ _id: req.params.id }, function(err, result) {
		if (err) throw err;
		result.answers.id(req.params.answer).correct = false;
		result.save(function (err) {
			if (err) throw err;
			res.redirect('/question/view/' + req.params.id);
		});
	});
});

router.get('/answer/delete/:answer/:id', isLoggedIn, function(req, res) {
	Question.findOne({ _id: req.params.id }, function(err, result) {
		if (err) throw err;
		result.answers.id(req.params.answer).remove();
		result.save(function (err) {
			if (err) throw err;
			res.redirect('/question/view/' + req.params.id);
		});
	});
});

router.get('/delete/:id', isLoggedIn, function(req, res) {
	Question.findOneAndRemove({ _id: req.params.id }, function(err) {
		if (err) throw err;
		res.redirect('/');
	});
});

function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
				return next();
		res.redirect('/auth/login');
}

module.exports = router;
