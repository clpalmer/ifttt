const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dbConfig = require('./config/database.config.js')

const app = express();

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

// define a simple route
app.get('/', (req, res) => {
  res.json({"message": "Hello!"});
});

// listen for requests
app.listen(3001, () => {
  console.log("Server is listening on port 3000");
});

require('./app/routes/buttonpress.routes.js')(app);
