import querystring from 'querystring';
import fetch from 'node-fetch';
import { Actions } from 'react-native-router-flux';
import { store } from './store';
import config from './config';
import { setToken, loggedOut, loggedIn, initComplete } from '../actions/session';
import { setLeds } from '../actions/leds';
import { setButtons } from '../actions/buttons';
import Debug from './debug';

const fetchUser = accessToken => (
  new Promise((resolve, reject) => {
    const url = `${config.ifttt.host}/ifttt/v1/user/info`;
    Debug.log('Fetching', url, '-', store.getState());
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => res.json())
      .then((json) => {
        if (json.errors || !json.data) {
          reject(json.errors);
        } else {
          resolve(json.data);
        }
      }).catch((err) => {
        reject(err);
      });
  })
);

const fetchButtons = accessToken => (
  new Promise((resolve, reject) => {
    const url = `${config.ifttt.host}/api/buttons`;
    Debug.log('Fetching', url, '-', store.getState());
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => res.json())
      .then((json) => {
        if (json.errors) {
          reject(json.errors);
        } else {
          resolve(json);
        }
      }).catch((err) => {
        reject(err);
      });
  })
);

const fetchLeds = accessToken => (
  new Promise((resolve, reject) => {
    const url = `${config.ifttt.host}/api/leds`;
    Debug.log('Fetching', url, '-', store.getState());
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => res.json())
      .then((json) => {
        if (json.errors) {
          reject(json.errors);
        } else {
          resolve(json);
        }
      }).catch((err) => {
        reject(err);
      });
  })
);

export default {
  init: () => {
    const state = store.getState();
    Debug.log('Initial state:', state);
    if (!state.session.accessToken) {
      store.dispatch(loggedOut());
    } else {
      fetchUser(state.session.accessToken).then((user) => {
        store.dispatch(loggedIn(user));
        fetchLeds(state.session.accessToken).then((leds) => {
          store.dispatch(setLeds(leds));
          fetchButtons(state.session.accessToken).then((buttons) => {
            store.dispatch(setButtons(buttons));
            store.dispatch(initComplete());
          }).catch((err) => {
            Debug.log('IFTTTApi - init:', err);
            store.dispatch(loggedOut());
          });
        }).catch((err) => {
          Debug.log('IFTTTApi - init:', err);
          store.dispatch(loggedOut());
        });
      }).catch((err) => {
        Debug.log('IFTTTApi - init:', err);
        store.dispatch(loggedOut());
      });
    }
  },
  login: (username, password) => (
    new Promise((resolve, reject) => {
      const url = `${config.ifttt.host}/oauth2/token`;
      Debug.log('Fetching', url, '-');
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
          username,
          password,
          grant_type: 'password',
          client_id: config.ifttt.clientId,
          scope: 'ifttt',
        }),
      }).then(res => res.json())
        .then((json) => {
          if (json.errors || !json.access_token) {
            reject(json.errors);
          } else {
            store.dispatch(setToken(json));
            fetchUser(json.access_token).then((user) => {
              Actions.leds();
              store.dispatch(loggedIn(user));
            }).catch((err) => {
              Debug.log('IFTTTApi - init:', err);
              Actions.login();
              store.dispatch(loggedOut());
            });
          }
        }).catch((err) => {
          reject(err);
        });
    })
  ),
  pressButton: (id) => {
    Debug.log('Pressing:', id);
  },
};

