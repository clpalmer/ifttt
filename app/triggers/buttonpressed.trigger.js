const ButtonPress = require('../models/buttonpress.model.js');

const buttonPressedTrigger = (req, res) => {
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
        res.send(bps.map((bp) => {
          return {
            buttonId: bp.buttonId,
            meta: {
              id: bp._id,
              timestamp: bp.createdAt.getTime()
            }
          }
        }));
      }
    })
}

module.exports = (app) => {
  app.post('/ifttt/v1/triggers/button_pressed', buttonPressedTrigger);
}
