const mongoose = require('mongoose')
const dbConfig = require('../config/database.config.js')
const OAuthClient = require('../app/oauth/oauthclient.model.js');
const OAuthAccessToken = require('../app/oauth//oauthaccesstoken.model.js');
const OAuthRefreshToken = require('../app/oauth//oauthrefreshtoken.model.js');
const OAuthAuthorizationCode = require('../app/oauth//oauthauthorizationcode.model.js');
const OAuthScopeModel = require('../app/oauth//oauthscope.model.js');
const User = require('../app/models/user.model.js');
const bcrypt = require('bcrypt');

mongoose.promise = global.Promise;
mongoose.connect(dbConfig.url)
  .then(() => {
    console.log('DB Connected');
    OAuthAuthorizationCode.find().remove();
    OAuthAccessToken.find().remove();
    OAuthRefreshToken.find().remove();
    User.find().remove().then(() => {
      User.create({
        firstName: 'Clancy',
        lastName: 'Palmer',
        email: 'clancyp@gmail.com',
        scope: 'ifttt',
        password: bcrypt.hashSync('Password1', 10),
      }).then((user) => {
        OAuthClient.find().remove().then(() => {
          OAuthClient.create({
            name:  'Test Client',
            id:  'test',
            secret: 'secret',
            redirectUris: 'http://localhost/cb',
            grants: ['authorization_code', 'password', 'refresh_token', 'client_credentials'],
            scope: 'test',
            accessTokenLifetime: 86400,
            refreshTokenLifetime: 3153600000,
            user: user._id,
          }).then(() => {

          });
          OAuthClient.create({
            name:  'IFTTT Client',
            id:  'ifttt',
            secret: 'iftttpw1!',
            redirectUris: 'https://ifttt.com/channels/nodeifttt/authorize',
            grants: ['authorization_code', 'refresh_token'],
            scope: 'ifttt',
            accessTokenLifetime: 86400,
            refreshTokenLifetime: 3153600000,
            user: user._id,
          }).then(() => {

          });
        });
      });
    })
  }).catch(err => {
    console.log('Failed to connect to DB (' + err + ')');
    process.exit();
  });