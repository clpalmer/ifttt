module.exports = (app) => {
    const c = require('../controllers/buttonpress.controller.js');

    // Create a button press
    app.post('/api/buttonpress', c.create);

    // Retrieve all button presses
    app.get('/api/buttonpress', c.findAll);
}
