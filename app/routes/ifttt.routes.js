module.exports = (app) => {
  const c = require('../controllers/ifttt.controller.js');

  // Create a button press
  app.post('/api/buttonpress', c.create);

  // Retrieve all button presses
  app.get('/api/buttonpress', c.findAll);
}
