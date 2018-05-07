var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OAuthScopeSchema = Schema({
  scope: String,
  isDefault: Boolean
});

module.exports = mongoose.model('OAuthScope', OAuthScopeSchema);
