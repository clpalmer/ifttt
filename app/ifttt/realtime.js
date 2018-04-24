const IFTTTConfig = require('../../config/ifttt.config.js');

module.exports.notifications = (users, triggerIdentities) => {
  data = [];

  if (Array.isArray(users)) {
    for (u of users) {
      data.push({
        user_id: u
      });
    }
  }

  if (Array.isArray(triggerIdentities)) {
    for (t of triggerIdentities) {
      data.push({
        trigger_identity: t
      });
    }
  }

  fetch(IFTTTConfig.api.realtimeNotifications, {
    method: 'POST',
    body: {data: data}
  });
}