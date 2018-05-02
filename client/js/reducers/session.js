import { SET_TOKEN, LOGGED_IN, LOGGED_OUT } from '../actions/session';

const initialState = {
  loading: true,
  accessToken: null,
  expires: 0,
  refreshToken: null,
};

export default function (state = initialState, action) {
  if (action.type === SET_TOKEN) {
    return {
      ...state,
      accessToken: action.token.access_token,
      expires: action.token.expires_in,
      refreshToken: action.token.refresh_token,
    };
  }

  if (action.type === LOGGED_OUT) {
    return {
      ...initialState,
      loading: false,
    };
  }

  if (action.type === LOGGED_IN) {
    return {
      ...state,
      user: action.user,
      loading: false,
    };
  }

  return state;
}
