import { createStore, combineReducers } from 'redux';
import { userReducer } from './user';

export default () => {
  let reducer = combineReducers({
    user: userReducer,
  });

  return createStore(reducer);
};
