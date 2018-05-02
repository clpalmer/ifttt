const Button = require('../models/button.model.js');

module.exports.index = (req, res) => {
  res.addScript('/js/buttons.js');
  Button.find().then((buttons) => {
    return res.render('buttons/index', {buttons: buttons || []});
  }).catch((err) => {
    return res.render('buttons/index', {error: err});
  })
};

module.exports.create = (req, res) => {
  res.addScript('/js/buttons.js');
  if (!req.body.id || !req.body.name || !req.body.pin) {
    if (req.xhr) {
      return res.status(400).send({error: 'Missing id, name or pin'});
    }
    req.flash('error', 'Missing id, name or pin');
    return res.redirect('/buttons');
  }
  Button.create({
    id: req.body.id,
    name: req.body.name,
    pin: req.body.pin
  }).then((button) => {
    if (req.xhr) {
      return res.send(button);
    }
    req.flash('success', 'Button created');
    return res.redirect('/buttons');
  }).catch((err) => {
    if (req.xhr) {
      return res.status(500).send({error: 'Unable to create button'});
    }
    req.flash('error', 'Unable to create button');
    return res.redirect('/buttons');
  });
}

module.exports.destroy = (req, res) => {
  Button.findOne({id: req.params.id}).then((button) => {
    if (!button) {
      req.flash('error', 'Button not found');
      return res.status(404).send();
    }
    button.remove();
    req.flash('success', 'Button deleted');
    return res.status(201).send();
  }).catch((err) => {
    req.flash('error', 'Unable to delete button');
    return res.status(500).send(err);
  });
};

module.exports.apiGetButtons = (req, res) => {
  Button.find().then((buttons) => {
    return res.send(buttons.map((b) => {
      return {
        id: b.id,
        name: b.name,
        pin: b.pin
      };
    }));
  }).catch((err) => {
    return res.status(500).send(err);
  })
};