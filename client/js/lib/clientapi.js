/* global WebSocket:false */

import { store } from './store';
import Config from './config';
import Debug from './debug';
import { toggleLed } from '../actions/leds';

let unsubscribe = null;
let accessToken = null;
let socket = null;

const connectSocket = () => {
  Debug.log('ClientApi - opening socket');
  socket = new WebSocket(`${Config.ifttt.socketHost}?token=${accessToken}`);
  Debug.log('ClientApi - opened socket');

  socket.onopen = () => {
    socket.send('ClientApi - socket opened');
  };

  socket.onclose = (e) => {
    Debug.log('ClientApi - socket closed (', e.code, '-', e.reason, ')');
    if (accessToken) {
      Debug.log('ClientApi - reconnecting');
      connectSocket();
    }
  };

  socket.onmessage = (e) => {
    Debug.log('ClientApi - message received: ', e.data);
    let message = null;
    try {
      message = JSON.parse(e.data);
    } catch (err) {
      Debug.log('ClientApi - failed to parse message:', err);
      return;
    }

    if (typeof message !== 'object' || !message.type) {
      Debug.log('ClientApi - invalid message');
      return;
    }

    if (message.type === 'setLed') {
      if (!message.data || !message.data.id || !message.data.state) {
        Debug.log('ClientApi - Invalid setLed data');
        return;
      }

      store.dispatch(toggleLed(message.data.id, message.data.state === 'on'));
    }
  };

  socket.onerror = (e) => {
    Debug.log('ClientApi - error:', e.message);
  };
};

const disconnectSocket = () => {
  socket.close();
  socket = null;
};

const checkTokenState = () => {
  Debug.log('checkTokenState - ', store.getState().session)
  try {
    ({ accessToken } = store.getState().session);
  } catch (e) {
    accessToken = null;
  }

  if (accessToken && !socket) {
    connectSocket();
  } else if (!accessToken && socket) {
    disconnectSocket();
  }
};

export default {
  init: () => {
    unsubscribe = store.subscribe(checkTokenState);
    checkTokenState();
  },

  close: () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  send: (type, data) => {
    if (socket) {
      socket.send(JSON.stringify({
        type,
        data,
      }));
    }
  },
};
