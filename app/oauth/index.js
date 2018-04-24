const OAuthServer = require('express-oauth-server');

module.exports = (app) => {
  app.oauth = new OAuthServer({
    debug: true,
    model: require('./models.js'),
    authenticateHandler: {
      handle: (req, res) => {
        return req.session.user;
      }
    }
  });

  app.all('/oauth2/authorize', app.authenticate(), app.oauth.authorize());
  app.all('/oauth2/token', app.oauth.token());
}