const USER__LOGIN = 'USER__LOGIN';
const USER__LOGOUT = 'USER__LOGOUT';

let defaultState = {
  email: '',
  loggedIn: false,
  firstName: '',
  lastName: '',
  fullName: '',
};

let userReducer = (state, action) => {
  let newState = Object.assign({}, defaultState, state);

  switch (action.type) {
    case USER__LOGIN:
      if (action.user && action.user.email) {
        newState.email = action.user.email;
        newState.loggedIn = true;
        newState.firstName = action.user.firstName || '';
        newState.lastName = action.user.lastName || '';
        newState.fullName = [action.user.firstName, action.user.lastName].join(' ').trim();
      }
      break;
    case USER__LOGOUT:
      Object.assign(newState, defaultState);
      break;
    default:
      break;
  }

  return newState;
};

let userActions = {
  login: (user) => {
    return {
      type: USER__LOGIN,
      user: user,
    };
  },
  logout: () => {
    return {
      type: USER__LOGOUT,
    };
  }
};

export {
  userReducer,
  userActions, 
};