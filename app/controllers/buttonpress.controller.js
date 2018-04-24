const ButtonPress = require('../models/buttonpress.model.js');

module.exports.create = (req, res) => {
  if(!req.body.id) {
    return res.status(400).send({
      message: "ERROR: Missing id"
    });
  }

  // TODO: Find Button and validate it exists

  const bp = new ButtonPress({
    id: req.body.id
  });

  bp.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Internal Server Error"
    });
  });
};

module.exports.findAll = (req, res) => {
  ButtonPress.find()
  .then(bp => {
    res.send(bp);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Internal Server Error"
    });
  });
};