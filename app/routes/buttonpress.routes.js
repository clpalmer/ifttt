module.exports = (app) => {
    const c = require('../controllers/buttonpress.controller.js');

    // Create a button press
    app.post('/buttonpress', c.create);

    // Retrieve all button presses
    app.get('/buttonpress', c.findAll);
}