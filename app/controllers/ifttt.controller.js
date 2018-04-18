const IFTTTConfig = require('../../config/ifttt.config.js');

module.exports.status = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({errors:[{message:'401'}]});
  }

  res.send({});
};

module.exports.setup = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    return res.status(401).send({errors:[{message:'401'}]});
  }

  res.send({
    data: {
      samples: {
        actions: {
        },
      }
    }
  });
};