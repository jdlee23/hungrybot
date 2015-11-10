var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var cookieParser   = require('cookie-parser');
var fs             = require('fs');
var fetch          = require('isomorphic-fetch');
var bot            = require('./util/bot');
var authMiddleware = require('./authMiddleware');
//Routes
var menu           = require('./routes/menu');
var business           = require('./routes/business');
var session        = require('./routes/session');
var phone          = require('./routes/phone');
//Model
var Business       = require('./model/Business');
var Customer       = require('./model/Customer');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hungrybot');

//Middleware + View Engine
app.set('view engine', 'jade');
app.set('views', './src/views');
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/menu', authMiddleware, menu);
app.use('/user', business);
app.use('/phone', phone);
app.use('/session', session);

app.get('/', function(req, res){
  var session = req.cookies.session || {};
	res.render('index', {name: session.name});
});

app.get('/stripe', authMiddleware, function(req, res){
  console.log('a', req.cookies.session);
  Business.findById(req.cookies.session._id, function(err, business){
    console.log('b', business, err);
    fetch('https://connect.stripe.com/oauth/token', {
      method: 'post',
      headers: {
        client_secret: process.env.STRIPE_SECRET_KEY,
        code: req.query.code,
        grant_type: 'authorization_code'
      }
    }).then(function(err, response) {
      console.log('c', err, business);      
      business.stripeAccount = response.json().stripe_user_id;
      console.log('d', business.stripeAccount);
      business.save(function(err){
        console.log('e', err);
        res.redirect('/user/upgrade');
      });
    });
  });
});


app.listen(process.env.PORT || 3000);