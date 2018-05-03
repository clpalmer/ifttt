const isPi = require('detect-rpi');
const IFTTTConfig = require('../../../config/ifttt.config.js');
const LED = require('../../models/led.model.js');
const ClientApi = require('../../clientapi');

const setLedAction = (req, res) => {
  if (!req.body.actionFields || !req.body.actionFields.state) {
    return res.status(400).send({errors:[{message:'400 - missing actionFields.state'}]});
  }

  if (!req.body.actionFields || !req.body.actionFields.led_id) {
    return res.status(400).send({errors:[{message:'400 - Missing actionFields.led_id'}]});
  }

  let led = LED.findOne({id: req.body.actionFields.led_id}, (err, led) => {
    if (err) {
      return res.status(500).send({errors:[{message:'500 - Internal Server Error'}]});
    }
    if (!led) {
      return res.status(404).send({errors:[{message:'404 - Unknown LED'}]});
    }

    if (led.id !== '00000000-0000-0000-000000000000') {
      ClientApi.action('setLed', {
        id: led.id,
        state: req.body.actionFields.state,
        value: req.body.actionFields.state === 'on' ? led.onValue : (1 - led.onValue),
      })
    }

    res.send({
      data: [
        {
          id: led._id
        }
      ]
    })
  });
}

const setLedActionLedIdOptions = (req, res) => {
  LED.find({}, (err, leds) => {
    let options = [];
    for (let led of leds) {
      options.push({
        value: led.id,
        label: led.name
      });
    }
    res.send({data: options});
  });
}

const setLedActionStateOptions = (req, res) => {
  res.send({data: [
    {
      value: 'off',
      label: 'Off'
    },
    {
      value: 'on',
      label: 'On'
    }
  ]});
}

module.exports = (app) => {
  app.post('/ifttt/v1/actions/setled/fields/led_id/options', app.oauth.authenticate({scope: 'ifttt'}), setLedActionLedIdOptions)
  app.post('/ifttt/v1/actions/setled/fields/state/options', app.oauth.authenticate({scope: 'ifttt'}), setLedActionStateOptions);
  app.post('/ifttt/v1/actions/setled', app.oauth.authenticate({scope: 'ifttt'}), setLedAction);
}
