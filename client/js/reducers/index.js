import { combineReducers } from 'redux';

import drawer from './drawer';
import leds from './leds';
import session from './session';

export default combineReducers({
  drawer,
  leds,
  session,
});
