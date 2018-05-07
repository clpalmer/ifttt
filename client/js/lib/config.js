import CustomConfig from './config.custom';

const config = {
  ifttt: {
    host: 'https://<replace this or add ifttt object to config.custom.js>',
    socketHost: 'wss://<replace this or add ifttt object to config.custom.js>',
    clientId: 'client',
  },
};

export default Object.assign(config, CustomConfig);
