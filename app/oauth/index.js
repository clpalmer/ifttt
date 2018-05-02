const OAuthServer = require('express-oauth-server');
const OAuthError = require('oauth2-server/lib/errors/oauth-error');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');

module.exports = (app) => {
  app.oauth = new OAuthServer({
    debug: true,
    model: require('./models.js'),
    authenticateHandler: {
      handle: (req, res) => {
        return req.session.user;
      }
    },
    useErrorHandler: true,
    requireClientAuthentication: {password: false},
  });

  app.all('/oauth2/authorize', app.authenticate(), app.oauth.authorize());
  app.all('/oauth2/token', app.oauth.token());

  app.use((e, req, res, next) => {
    if (e instanceof OAuthError) {
      res.status(e.code);

      if (e instanceof UnauthorizedRequestError) {
        return res.send();
      }

      return res.send({
        errors: [{
          type: e.name,
          message: e.message
        }]
      });
    }
    next(e);
  });
}
