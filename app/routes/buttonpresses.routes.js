module.exports = (app) => {
  const c = require('../controllers/buttonpresses.controller.js');

  app.get('/buttonpresses', app.authenticate(), c.index);
  app.post('/buttonpresses', app.authenticate(), c.create);
  
  app.get('/api/buttonpresses', app.oauth.authenticate({scope: 'ifttt'}), c.apiGetButtonPresses);
  app.post('/api/buttonpresses', app.oauth.authenticate({scope: 'ifttt'}), c.apiPressButton);
}
