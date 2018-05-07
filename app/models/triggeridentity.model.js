const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TriggerIdentitySchema = mongoose.Schema({
  id: String,
  triggerFields: Schema.Types.Mixed,
  button: { type : Schema.Types.ObjectId, ref: 'Button' },
  user: { type : Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('TriggerIdentity', TriggerIdentitySchema);