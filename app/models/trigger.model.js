const mongoose = require('mongoose');

const TriggerSchema = mongoose.Schema({
  id: String,
  pin: {
    type: Number,
    min: 1,
    max: 40
  },
  onValue: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trigger', TriggerSchema);