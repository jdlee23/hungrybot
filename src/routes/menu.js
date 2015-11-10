var express = require('express');
var router  = express.Router();
var Menu    = require('../model/Menu');

router.get('/', function(req, res) {
  Menu.find({businessId: req.cookies.session._id},function (err, menuItems) {
    res.render('menu/menu', {menuItems: menuItems});
  })
});

router.post('/create', function(req, res){
  var setPrice = req.body.menuPriceDollars.toString().concat(req.body.menuPriceCents.toString());
  Menu.create({businessId: req.cookies.session._id, name: req.body.name, description: req.body.description, price: setPrice}, function(){
    res.redirect(req.baseUrl);
  });
});

module.exports = router;