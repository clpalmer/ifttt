const mongoose = require('mongoose');

const ButtonPressSchema = mongoose.Schema({
  buttonId: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('ButtonPress', ButtonPressSchema);