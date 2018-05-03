const IFTTTConfig = require('../../config/ifttt.config.js');

const validateIftttHeader = (req, res, next) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({errors:[{message:'401'}]});
  }
  return next();
};

module.exports = (app) => {
  const c = require('./ifttt.controller.js');

  require('./actions/setled.action.js')(app);
  require('./triggers/buttonpressed.trigger.js')(app);

  app.post('/ifttt/v1/test/setup', validateIftttHeader, c.setup);
  app.get('/ifttt/v1/status', validateIftttHeader, c.status);
  app.get('/ifttt/v1/user/info', app.oauth.authenticate({scope: 'ifttt'}), c.userInfo);
}

