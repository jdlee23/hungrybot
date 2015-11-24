var router              = require('express').Router();
var validators          = require('../validators');
var authMiddleware      = require('../authMiddleware');
var Business            = require('../model/Business');
var Menu                = require('../model/Menu');
var refreshMenuEntities = require('../util/ai').refreshMenuEntities;

router.get('/', authMiddleware, function(req, res) {
  Menu.find({businessId: req.session._id},function (err, menuItems) {
    res.send(menuItems);
  })
});

router.post('/create', authMiddleware, async function(req, res){
  try {
    await validators.menu(req);
    var menu = await Menu.create({
      businessId: req.session._id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price * 100
    });
    await refreshMenuEntities(req.session._id);
    res.send(menu);
  } catch (errors) {
    res.status(400).send(errors);
  }
});

router.put('/update/:id', authMiddleware, async function(req, res){
  try {
    await validators.menu(req);

    var updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price * 100
    };
    var menu = await Menu.findOneAndUpdate({_id: req.params.id, businessId: req.session._id}, updateData, {new: true}).exec();
    res.send(menu);
  } catch (errors) {
    res.status(400).send(errors);
  }
});

router.delete('/delete/:id', authMiddleware, async function(req, res){
  await Menu.findOneAndRemove({_id: req.params.id, businessId: req.session._id}).exec();
  res.status(200).end();
});

module.exports = router;