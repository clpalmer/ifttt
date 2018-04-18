const IFTTTConfig = require('../../config/ifttt.config.js');

module.exports.status = (req, res) => {
  if (req.headers['IFTTT-Service-Key'] !== IFTTTConfig.serviceKey) {
    return res.status(401).send({
      message: 'Unauthorized'
    });
  }

  res.send({});
};

module.exports.setup = (req, res) => {
  if (req.headers['IFTTT-Service-Key'] !== IFTTTConfig.serviceKey) {
    return res.status(401).send({
      message: 'Unauthorized'
    });
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