import { combineReducers } from 'redux';

import drawer from './drawer';
import leds from './leds';
import buttons from './buttons';
import session from './session';

export default combineReducers({
  drawer,
  leds,
  session,
  buttons,
});
