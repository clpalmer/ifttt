import { userActions } from '../reducers/user';

let _state = {
  store: null,
  unsubscribe: null,
  user: {}
};

let _handleChange = () => {
  _state.user = _state.store.getState().user;
};

let Authentication = {
  setStore: (store) => {
    if (_state.unsubscribe) {
      _state.unsubscribe();
    }

    _state.store = store;
    _state.unsubscribe = _state.store.subscribe(_handleChange);
  },
  login(username, password, cb) {
    let _cb = (res) => {
      if (typeof(cb) === 'function') {
        cb(res);
      }
    };

    setTimeout(() => {
      if (username === 'joe' && password === 'smith') {
        _state.store.dispatch(userActions.login({firstName: 'Joe', lastName: 'Smith', email: 'joe@smith.com'}));
        _cb(true);
      } else if (username === 'bob' && password === 'dole') {
        _state.store.dispatch(userActions.login({firstName: 'Bob', lastName: 'Dole', email: 'bob@dole.com'}));
        _cb(true);
      } else {
        _cb(false);
      }
    }, 300);
  },
  logout() {
    this.props.dispatch(userActions.logout());
  },
  loggedIn() {
    return _state.loggedIn;
  }
};

export default Authentication;