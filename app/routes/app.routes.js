module.exports = (app) => {
  const c = require('../controllers/app.controller.js');

  app.get('/login', c.login);
  app.post('/login', c.authenticate);
  app.get('/logout', c.logout);
  app.get('/', app.authenticate(), c.index);
}
