const IFTTTConfig = require('../../../config/ifttt.config.js');
const Button = require('../../models/button.model.js');
const ButtonPress = require('../../models/buttonpress.model.js');
const TriggerIdentity = require('../../models/triggeridentity.model.js');

const buttonPressedTrigger = (req, res) => {
  if (!req.body.triggerFields || !req.body.triggerFields.button_id) {
    return res.status(400).send({errors:[{message:'400 - Missing button_id'}]});
  }

  if (req.body.limit === 0) {
    return res.send({data: []});
  }

  const sendButtonPresses = (buttonId) => {
    ButtonPress
      .find({button: buttonId})
      .populate('button')
      .sort({'createdAt': -1})
      .limit(req.body.limit || 50)
      .then((bps) => {
        res.send({
          data: bps.map((bp) => {
            return {
              button_id: bp.button.id,
              created_at: bp.createdAt,
              meta: {
                id: bp._id,
                timestamp: Math.round(bp.createdAt.getTime() / 1000)
              }
            }
          })
        });
      }).catch((err) => {
        console.log('buttonPressedTrigger - Error finding ButtonPress - ', err);
        res.send({data: []});
      });
  }

  Button.findOne({id: req.body.triggerFields.button_id}).then((button) => {
    if (!button) {
      console.log('buttonPressedTrigger - Button not found (', req.body.triggerFields.button_id, ')');
      return res.send({data: []});
    }

    TriggerIdentity.findOne({id: req.body.trigger_identity}).then((tid) => {
      if (!tid) {
        TriggerIdentity.create({
          id: req.body.trigger_identity,
          button: button._id,
          triggerFields: req.body.trigger_fields,
          user: res.locals.oauth.token.user._id,
        }).then((newTid) => {
          sendButtonPresses(button._id);
        });
      } else {
        sendButtonPresses(button._id);
      }
    }).catch((err) => {
      console.log('buttonPressedTrigger - Error finding TriggerIdentity - ', err);
      res.send({data: []});
    });
  }).catch((err) => {
      console.log('buttonPressedTrigger - Error finding Button - ', err);
    res.send({data: []});
  });
}

const buttonPressedTriggerOptions = (req, res) => {
  Button.find({}, (err, buttons) => {
    let options = [];
    for (let button of buttons) {
      options.push({
        value: button.id,
        label: button.name
      });
    }
    res.send({data: options});
  });
}

const buttonPressedTriggerDelete = (req, res) => {
  // TODO: Delete trigger
  console.log('Deletting trigger identity:',req.params.tid);
  res.status(201).send();
}

module.exports = (app) => {
  const r = IFTTTConfig.endpoints.triggers + '/buttonpressed';

  app.post(`${r}/fields/button_id/options`, app.oauth.authenticate({scope: 'ifttt'}), buttonPressedTriggerOptions);
  app.delete(`${r}/trigger_identity/:tid`, app.oauth.authenticate({scope: 'ifttt'}), buttonPressedTriggerDelete);
  app.post(r, app.oauth.authenticate({scope: 'ifttt'}), buttonPressedTrigger);
}
