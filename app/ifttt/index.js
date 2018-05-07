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

  const r = IFTTTConfig.endpoints.base;
  app.post(`${r}/test/setup`, validateIftttHeader, c.setup);
  app.get(`${r}/status`, validateIftttHeader, c.status);
  app.get(`${r}/user/info`, app.oauth.authenticate({scope: 'ifttt'}), c.userInfo);
}

