const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAccessTokenSchema = Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  scope:  String,
  user:  { type : Schema.Types.ObjectId, ref: 'User' },
  client: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
}, {
  timestamps: true
});

module.exports = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);