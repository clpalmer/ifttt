const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthClientSchema = Schema({
  name:  String,
  id:  String,
  secret: String,
  redirectUris: [{type: String}],
  grants: [{type: String}],
  scope: String,
  accessTokenLifetime: Number,
  refreshTokenLifetime: Number,
  user:  { type : Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);