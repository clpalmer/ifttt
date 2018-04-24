const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dbConfig = require('./config/database.config.js')
const LED = require('./app/models/led.model.js');
const Button = require('./app/models/button.model.js');
const isPi = require('detect-rpi');
const morganBody = require('morgan-body');
const User = require('./app/models/user.model.js');
const session = require('express-session');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(require('express-layout')());
app.set('layouts', './app/views/layouts');
app.set('layout', 'layout');
morganBody(app);

app.use(session({
  secret: 'jomama',
  resave: true,
  saveUninitialized: false
}));

app.authenticate = () => {
  return (req, res, next) => {
    const loginUrl = '/login?redirect_uri=' + encodeURIComponent(req.originalUrl);
    if (!req.session.user) {
      console.log('app.authenticate - Not authenticated');
      return res.redirect(loginUrl);
    } else {
      console.log('app.authenticate - Authenticated');
      return next();
    }
  }
}

require('./app/oauth')(app)

// Configuring the DB
mongoose.promise = global.Promise;
mongoose.connect(dbConfig.url)
  .then(() => {
    console.log('DB Connected');
  }).catch(err => {
    console.log('Failed to connect to DB (' + err + ')');
    process.exit();
  });

// Configure LED pins
LED.find({}, (err, leds) => {
  for (let led of leds) {
    if (led.id === '00000000-0000-0000-000000000000') {
      // Skip test LED
      continue;
    }
    if (isPi()) {
      rpio.open(led.pinNumber, rpio.OUTPUT, (1 - led.onValue));
    }
  }
});

// Configure Button pins
Button.find({}, (err, buttons) => {
  for (let button of buttons) {
    if (isPi()) {
      rpio.open(button.pinNumber, rpio.OUTPUT, led.onValue ? rpio.LOW : rpio.HIGH);
    }
  }
});

// listen for requests
app.listen(3001, () => {
  console.log("Server is listening on port 3000");
});

require('./app/routes/buttonpress.routes.js')(app);
require('./app/routes/ifttt.routes.js')(app);
require('./app/routes/app.routes.js')(app);
require('./app/actions/setled.action.js')(app);
require('./app/triggers/buttonpressed.trigger.js')(app);
