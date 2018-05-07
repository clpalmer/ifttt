let config = {
  serviceKey: "<replace this with your IFTTT service key>",
  notificationsUrl: "https://realtime.ifttt.com/v1/notifications",
  endpoints: {
    base: '/ifttt/v1',
    triggers: '/ifttt/v1/triggers',
    actions: '/ifttt/v1/actions',
  },
  authRedirectUrl: 'https://ifttt.com/channels/nodeifttt/authorize',
};

try {
  config = Object.assign(config, require('./ifttt.config.custom.js'))
} catch (e) {}

module.exports = config;