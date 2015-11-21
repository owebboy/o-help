var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Topic = require('../models/topic');
var Question = require('../models/question');
var Account = require('../models/account');


/// ADMIN
router.get('/admin/add', isLoggedIn, function (req, res) {
	Account.findOneAndUpdate({ username: req.query['content'] }, { admin: true }, function (err, result) {
		if (err) throw err;
		res.redirect('/topic/admin');
	});
});

router.get('/admin', isLoggedIn, function (req, res) {
	if (req.user.admin == false) {
		res.redirect('/');
	} else {
		Account.find({ admin: true }, function (err, account) {
			Topic.find({}, function (err, result) {
				if (err) throw err;
				res.render('admin', {
					user: req.user,
					title: 'administration',
					active: 'home',
					topic: result,
					account: account
				});
			});
		});
	}
});

router.post('/admin/new', isLoggedIn, function (req, res) {
	Topic.create({
		topic: req.body.content,
		date: {
			created: new Date
		}
	}, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.redirect('/topic/admin');
	});
});

router.post('/admin/update/:topic', isLoggedIn, function (req, res) {
	Topic.findOneAndUpdate({ _id: req.params.topic }, {
		topic: req.params.content
	}, function (err, result) {
		if (err) throw err;
		res.redirect('/topic/admin');
	});
});

router.get('/admin/delete/:topic', isLoggedIn, function (req, res) {
	Topic.findOneAndRemove({ _id: req.params.topic }, function (err) {
		if (err) throw err;
	});
	Question.remove({ topic: req.params.topic }, function (err) {
		if (err) throw err;
	});
	
	res.redirect('/topic/admin');
});

router.get('/admin/remove/:id', isLoggedIn, function (req, res) {
	Account.findOneAndUpdate({ _id: req.params.id }, { admin: false }, function (err, result) {
		if (err) throw err;
		
		if (req.params.id === req.user.id) {
			res.redirect('/');
		} else {
			res.redirect('/topic/admin');
		}
	});
})

/// VIEWER
router.get('/:topic', function (req, res) {
	Topic.findOne({ _id: req.params.topic }, function (err, topic) {
		if (err) throw err;
		Question.find({ topic: req.params.topic }, function (err, result) {
			if (err) throw err;
			res.render('index', { user : req.user, title: 'ohomies', active: 'home', question: result, type: 'questions', topic: topic });
		}); 
	})
});

function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
				return next();
		res.redirect('/auth/login');
}

module.exports = router;
