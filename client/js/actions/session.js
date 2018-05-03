export const SET_TOKEN = 'SET_TOKEN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const INIT_COMPLETE = 'INIT_COMPLETE';

export function setToken(token) {
  return {
    type: SET_TOKEN,
    token,
  };
}

export function loggedIn(user) {
  return {
    type: LOGGED_IN,
    user,
  };
}

export function loggedOut() {
  return {
    type: LOGGED_OUT,
  };
}

export function initComplete() {
  return {
    type: INIT_COMPLETE,
  };
}
