const IFTTTConfig = require('../../config/ifttt.config.js');
const LED = require('../models/led.model.js');
const Button = require('../models/button.model.js');
const ButtonPress = require('../models/buttonpress.model.js');

module.exports.userInfo = (req, res) => {
  console.log('userInfo - res.locals:',res.locals);
  let data = {};
  try {
    let user = res.locals.oauth.token.user;
    data = {
      name: user.firstName + ' ' + user.lastName,
      id: user.email
    }
  } catch(e) {
    
  }
  return res.send({data: data});
};

module.exports.status = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({errors:[{message:'401'}]});
  }

  res.send({});
};

module.exports.setup = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    return res.status(401).send({errors:[{message:'401'}]});
  }

  LED.findOne({id: '00000000-0000-0000-000000000000'}, (err, led) => {
    if (!led) {
      let newLed = new LED({
        id: '00000000-0000-0000-000000000000',
        name: 'Test LED',
        onValue: 1
      });
      newLed.save();
    }
  });

  Button.findOne({id: '00000000-0000-0000-000000000000'}, (err, button) => {
    if (!button) {
      let newButton = new Button({
        id: '00000000-0000-0000-000000000000',
        name: 'Test Button',
        pin: 1
      });
      newButton.save();
    }
  });

  ButtonPress.find({}, (err, buttonpresses) => {
    if (err || buttonpresses.length < 3) {
      for (let i = 0; i < (3 - (buttonpresses.length || 0)); i++) {
        let bp = new ButtonPress({
          buttonId: '00000000-0000-0000-000000000000'
        });
        bp.save();
      }
    }
  })

  res.send({
    data: {
      samples: {
        actions: {
          setled: {
            state: 'on',
            led_id: '00000000-0000-0000-000000000000'
          }
        },
        triggers: {
          buttonpressed: {
            button_id: '00000000-0000-0000-000000000000'
          }
        }
      }
    }
  });
};