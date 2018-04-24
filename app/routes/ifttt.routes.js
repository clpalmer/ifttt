module.exports = (app) => {
  const c = require('../controllers/ifttt.controller.js');

  app.post('/ifttt/v1/test/setup', c.setup);
  app.get('/ifttt/v1/status', app.oauth.authenticate({scope: 'ifttt'}), c.status);
  app.get('/ifttt/v1/user/info', app.oauth.authenticate({scope: 'ifttt'}), c.userInfo);
}
