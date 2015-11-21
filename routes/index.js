var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Topic = require('../models/topic');

router.get('/', function (req, res) {
  Topic.find({}, function(err, result) {
    if (err) throw err;
    res.render('index', { user : req.user, title: 'topics', active: 'home', question: result, type: 'topics' });
  }); 
});

module.exports = router;
