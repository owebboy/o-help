var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/register', function(req, res) {
  res.render('register', { active: 'register' });
});

router.post('/register', function(req, res, next) {
  Account.register(new Account({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render("register", {
        info: "username already exists!",
        active: 'register'
      });
    }

    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});


router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user,
    active: 'login'
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render("login", { info: "username and password do not match!", active: 'login' }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
