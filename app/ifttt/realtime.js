const fetch = require('node-fetch');
const IFTTTConfig = require('../../config/ifttt.config.js');
const TriggerIdentity = require('../models/triggeridentity.model.js');

const notifications = (triggerIdentities, users) => {
  data = [];
  if (Array.isArray(triggerIdentities)) {
    for (t of triggerIdentities) {
      data.push({
        trigger_identity: t
      });
    }
  }

  if (Array.isArray(users)) {
    for (u of users) {
      data.push({
        user_id: u
      });
    }
  }
  
  fetch(IFTTTConfig.notificationsUrl, {
    headers: {
      'ifttt-service-key': IFTTTConfig.serviceKey,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({data: data})
  }).then((resp) => {
    console.log('notifications - Success');
  }).catch((err) => {
    console.log('notifications - Failed to notify - ', err);
  });
}

const notifyButtonPress = (button) => {
  TriggerIdentity.find({button: button._id}).then((tids) => {
    notifications(tids.map((tid) => { return tid.id; }));      
  }).catch((err) => {
    console.log('notifyButtonPress - Error finding TriggerIdentity - ', err);
  });
}

module.exports = {
  notifications,
  notifyButtonPress,
}