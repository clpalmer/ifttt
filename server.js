const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dbConfig = require('./config/database.config.js')
const LED = require('./app/models/led.model.js');
const Button = require('./app/models/button.model.js');
const morganBody = require('morgan-body');
const User = require('./app/models/user.model.js');
const session = require('express-session');
const flash = require('express-flash-messages');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(require('express-layout')());
app.set('layouts', './app/views/layouts');
app.set('layout', 'layout');
app.use(express.static('assets'));
app.use(flash());
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
      res.locals.user = req.session.user;
      return next();
    }
  }
}

app.use((req, res, next) => {
  res.locals.currentPath = req.path.replace(/^\//,'');

  res.locals.scripts = ['/js/app.js'];
  res.addScript = (script) => {
    res.locals.scripts.push(script);
  };

  res.locals.getFlashes = () => {
    let flashes = [];
    let messages = res.locals.getMessages();
    Object.keys(messages).forEach((type) => {
      flashes = flashes.concat(messages[type].map(function(msg) {
        return {type: type, msg: msg}
      }));
    });
    return flashes;
  };

  next();
})

// Configuring the DB
mongoose.promise = global.Promise;
mongoose.connect(dbConfig.url)
  .then(() => {
    console.log('DB Connected');
  }).catch(err => {
    console.log('Failed to connect to DB (' + err + ')');
    process.exit();
  });

// listen for requests
const server = app.listen(3001, () => {
  console.log("Server is listening on port 3000");
});

require('./app/oauth')(app);  // This must be required first
require('./app/routes')(app);
require('./app/ifttt')(app);
require('./app/clientapi').init(app);
