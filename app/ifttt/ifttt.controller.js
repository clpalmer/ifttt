const IFTTTConfig = require('../../config/ifttt.config.js');
const User = require('../models/user.model.js');
const LED = require('../models/led.model.js');
const Button = require('../models/button.model.js');
const ButtonPress = require('../models/buttonpress.model.js');
const OAuthClient = require('../oauth/oauthclient.model.js');
const OAuthAccessToken = require('../oauth//oauthaccesstoken.model.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  res.send({});
};

module.exports.setup = (req, res) => {
  LED.findOne({id: '00000000-0000-0000-000000000000'}, (err, led) => {
    if (!led) {
      LED.create({
        id: '00000000-0000-0000-000000000000',
        name: 'Test LED',
        onValue: 1
      });
    }
  });

  Button.findOne({id: '00000000-0000-0000-000000000000'}, (err, button) => {
    if (!button) {
      Button.create({
        id: '00000000-0000-0000-000000000000',
        name: 'Test Button',
        pin: 1
      });
    }
  });

  ButtonPress.find({}, (err, buttonpresses) => {
    if (err || buttonpresses.length < 3) {
      for (let i = 0; i < (3 - (buttonpresses.length || 0)); i++) {
        ButtonPress.create({
          buttonId: '00000000-0000-0000-000000000000'
        });
      }
    }
  })

  User.create({
    firstName: 'IFTTT',
    lastName: 'Test',
    email: 'ifttt@test.com',
    scope: 'ifttt',
    password: bcrypt.hashSync('iftttpw1!', 10),
  }).then((user) => {
    OAuthClient.create({
      name:  'IFTTT Test Client',
      id:  'ifttttest',
      secret: 'iftttpw1!',
      redirectUris: 'https://ifttt.com/channels/nodeifttt/authorize',
      grants: ['authorization_code', 'refresh_token'],
      scope: 'ifttt',
      accessTokenLifetime: 86400,
      refreshTokenLifetime: 3153600000,
      user: user._id,
    }).then((client) => {
      let token = crypto.createHash('sha1').update(crypto.randomBytes(256)).digest('hex');
      OAuthAccessToken.create({
        accessToken: token,
        accessTokenExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
        scope: 'ifttt',
        user: user._id,
        client: client._id,
      }).then((accessToken) => {
        res.send({
          data: {
            accessToken: accessToken.accessToken,
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
      });
    });
  });
};