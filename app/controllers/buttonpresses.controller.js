const ButtonPress = require('../models/buttonpress.model.js');
const Button = require('../models/button.model.js');
const Realtime = require('../ifttt/realtime.js');

let getButtons = (req, res, api) => {
  Button.find().then((buttons) => {
    res.locals.buttons = buttons;
    ButtonPress.find().sort({createdAt: -1}).populate('button').then((buttonPresses) => {
      if (api) {
        return res.send(buttonPresses);
      }
      return res.render('buttonpresses/index', {buttonPresses: buttonPresses || []});
    }).catch((err) => {
      if (api) {
        return res.status(500).send({error: 'Unable to press button'});
      }
      return res.render('buttonpresses/index', {error: err});
    })
  }).catch((err) => {
    return res.render('buttonpresses/index', {error: err});
  });
};

let createButton = (req, res, api) => {
  api = api || req.xhr;

  if (!req.body.buttonid) {
    if (api) {
      return res.status(400).send({error: 'Missing buttonid'});
    }
    req.flash('error', 'Missing buttonid');
    return res.redirect('/buttonpresses');
  }
  Button.findOne({id: req.body.buttonid}).then((button) => {
    if (!button) {
      if (api) {
        return res.status(404).send({error: 'Button not found'});
      }
      req.flash('error', 'Button not found');
      return res.redirect('/buttonpresses');
    }
    ButtonPress.create({
      button: button._id,
    }).then((buttonpress) => {
      Realtime.notifyButtonPress(button);

      if (api) {
        buttonpress.button = button;
        return res.send(buttonpress);
      }
      req.flash('success', 'Button pressed');
      return res.redirect('/buttonpresses');
    }).catch((err) => {
      if (api) {
        return res.status(500).send({error: 'Unable to press button - Error creating ButtonPress for button: ' + button._id});
      }
      req.flash('error', 'Unable to press button' + err);
      return res.redirect('/buttonpresses');
    });
  }).catch((err) => {
    if (api) {
      return res.status(500).send({error: 'Unable to press button - Error finding Button'});
    }
    req.flash('error', 'Unable to press button');
    return res.redirect('/buttonpresses');
  });
}

module.exports.index = (req, res) => {
  return getButtons(req, res, false);
}
module.exports.apiGetButtonPresses = (req, res) => {
  return getButtons(req, res, true);
}
module.exports.create = (req, res) => {
  return createButton(req, res, false);
};
module.exports.apiPressButton = (req, res) => {
  return createButton(req, res, true);
};
