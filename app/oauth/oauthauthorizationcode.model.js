const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAuthorizationCodeSchema = Schema({
  authorizationCode: String,
  expiresAt: Date,
  redirectUri: String,
  scope: String,
  user: { type : Schema.Types.ObjectId, ref: 'User' },
  client: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
}, {
  timestamps: true
});

module.exports = mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);

