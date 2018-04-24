const ButtonPress = require('../models/buttonpress.model.js');
const IFTTTConfig = require('../../config/ifttt.config.js');
const Button = require('../models/button.model.js');

const buttonPressedTrigger = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({errors:[{message:'401'}]});
  }

  if (!req.body.triggerFields || !req.body.triggerFields.button_id) {
    return res.status(400).send({errors:[{message:'400 - Missing button_id'}]});
  }

  if (req.body.limit === 0) {
    return res.send({data: []});
  }

  ButtonPress
    .find({buttonId: req.body.triggerFields.button_id})
    .sort({'createdAt': -1})
    .limit(req.body.limit || 50)
    .exec((err, bps) => {
      if (err) {
        res.status(500).send({
          message: err || "Internal Server Error"
        });
      } else {
        res.send({
          data: bps.map((bp) => {
            return {
              button_id: bp.buttonId,
              created_at: bp.createdAt,
              meta: {
                id: bp._id,
                timestamp: Math.round(bp.createdAt.getTime() / 1000)
              }
            }
          })
        });
      }
    })
}

const buttonPressedTriggerOptions = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({errors:[{message:'401'}]});
  }

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
  res.status(201).send();
}

module.exports = (app) => {
  const r = IFTTTConfig.endpoints.triggers + '/buttonpressed';

  app.post(r, app.oauth.authenticate(), buttonPressedTrigger);
  app.post(r + '/fields/button_id/options', app.oauth.authenticate({scope: 'ifttt'}), buttonPressedTriggerOptions);
  app.delete(r + '/trigger_identity/:tid', app.oauth.authenticate({scope: 'ifttt'}), buttonPressedTriggerDelete);
}
