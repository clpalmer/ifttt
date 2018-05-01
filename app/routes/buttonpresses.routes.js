module.exports = (app) => {
  const c = require('../controllers/buttonpresses.controller.js');

  app.get('/buttonpresses', app.authenticate(), c.index);
  app.post('/buttonpresses', app.authenticate(), c.create);
  
  app.post('/api/buttonpresses', app.authenticateApi(), c.apiPressButton);
}
