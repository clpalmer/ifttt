const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dbConfig = require('./config/database.config.js')
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));

// parse requests of content-type - application/json
app.use(bodyParser.json())

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
app.listen(3001, () => {
  console.log("Server is listening on port 3000");
});

require('./app/routes/buttonpress.routes.js')(app);
