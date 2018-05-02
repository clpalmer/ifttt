module.exports = (app) => {
  const c = require('../controllers/buttons.controller.js');

  app.get('/buttons', app.authenticate(), c.index);
  app.post('/buttons', app.authenticate(), c.create);
  app.delete('/buttons/:id', app.authenticate(), c.destroy);

  app.get('/api/buttons', app.authenticateApi(), c.apiGetButtons);
}
