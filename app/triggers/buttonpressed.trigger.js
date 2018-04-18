const ButtonPress = require('../models/buttonpress.model.js');
const IFTTTConfig = require('../../config/ifttt.config.js');

const buttonPressedTrigger = (req, res) => {
  if (req.headers['ifttt-service-key'] !== IFTTTConfig.serviceKey) {
    console.log('Headers: ' + JSON.stringify(req.headers['ifttt-service-key']));
    return res.status(401).send({
      message: 'Unauthorized'
    });
  }

  if (req.body.limit === 0) {
    return res.send({data: []});
  }

  ButtonPress
    .find(/* TODO: Limit to requested user/buttonId/etc */)
    .sort({'createdAt': -1})
    .limit(req.body.limit || 50)
    .exec((err, bps) => {
      if (err) {
        res.status(500).send({
          message: err || "Internal Server Error"
        });
      } else {
        res.send({
          data: bps.map((bp) => {
            return {
              button_id: bp.buttonId,
              created_at: bp.createdAt,
              meta: {
                id: bp._id,
                timestamp: Math.round(bp.createdAt.getTime() / 1000)
              }
            }
          })
        });
      }
    })
}

module.exports = (app) => {
  app.post('/ifttt/v1/triggers/buttonpressed', buttonPressedTrigger);
}
