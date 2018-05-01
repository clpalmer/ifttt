const LED = require('../models/led.model.js');

module.exports.index = (req, res) => {
  res.addScript('/js/leds.js');
  LED.find().then((leds) => {
    return res.render('leds/index', {leds: leds || []});
  }).catch((err) => {
    return res.render('leds/index', {error: err});
  })
};

module.exports.create = (req, res) => {
  res.addScript('/js/leds.js');
  if (!req.body.id || !req.body.name || !req.body.pin || !req.body.onvalue) {
    if (req.xhr) {
      return res.status(400).send({error: 'Missing id, name, pin or onvalue'});
    }
    req.flash('error', 'Missing id, name, pin or onvalue');
    return res.redirect('/leds')
  }
  LED.create({
    id: req.body.id,
    name: req.body.name,
    pin: req.body.pin,
    onValue: req.body.onvalue
  }).then((led) => {
    if (req.xhr) {
      return res.send(led);
    }
    req.flash('success', 'LED created');
    return res.redirect('/leds');
  }).catch((err) => {
    if (req.xhr) {
      return res.status(500).send({error: 'Unable to create LED'});
    }
    req.flash('error', 'Unable to create LED');
    return res.redirect('/leds');
  });
}

module.exports.destroy = (req, res) => {
  LED.findOne({id: req.params.id}).then((led) => {
    if (!led) {
      req.flash('error', 'LED not found');
      return res.status(404).send();
    }
    led.remove();
    req.flash('success', 'LED deleted');
    return res.status(201).send();
  }).catch((err) => {
    req.flash('error', 'Unable to delete LED');
    return res.status(500).send(err);
  });
}

module.exports.apiGetLEDs = (req, res) => {
  LED.find().then((leds) => {
    return res.send(leds.map((l) => {
      return {
        id: l.id,
        name: l.name,
        pin: l.pin,
        onValue: l.onValue
      };
    }));
  }).catch((err) => {
    return res.status(500).send(err);
  })
};