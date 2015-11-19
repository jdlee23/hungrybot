var router         = require('express').Router();
var bcrypt         = require('bcrypt');
var jwt            = require('jsonwebtoken');
var _              = require('underscore');
var Business       = require('../model/Business');
var authMiddleware = require('../authMiddleware');
var validators     = require('../validators');

router.get('/logout', function(req, res){
  res.clearCookie('session');
  res.redirect('/');
});

router.get('/login', function(req, res) {
  res.render('session/login');
});

router.post('/login', async function(req, res){
    var business = await Business.findOne({name: req.body.name}).exec();
    var errors = validators.login(req, business);
    if (errors) {
      res.render('session/login', errors);
    } else {
      res.cookie('session', jwt.sign(business, process.env.JWT_SECRET_KEY));
      res.redirect('/');
    }
});

module.exports = router;