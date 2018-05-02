import { combineReducers } from 'redux';

import drawer from './drawer';
import leds from './leds';

export default combineReducers({
  drawer,
  leds,
});
