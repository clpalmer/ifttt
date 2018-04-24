const mongoose = require('mongoose');

const ButtonSchema = mongoose.Schema({
  name: String,
  id: String,
  pin: {
    type: Number,
    min: 1,
    max: 40
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Button', ButtonSchema);