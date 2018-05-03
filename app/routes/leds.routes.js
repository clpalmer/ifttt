module.exports = (app) => {
  const c = require('../controllers/leds.controller.js');

  app.get('/leds', app.authenticate(), c.index);
  app.post('/leds', app.authenticate(), c.create);
  app.delete('/leds/:id', app.authenticate(), c.destroy);

  app.get('/api/leds', app.oauth.authenticate({scope: 'ifttt'}), c.apiGetLEDs);
}
