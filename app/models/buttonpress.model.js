const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ButtonPressSchema = Schema({
  button: { type : Schema.Types.ObjectId, ref: 'Button' },
}, {
  timestamps: true
});

module.exports = mongoose.model('ButtonPress', ButtonPressSchema);