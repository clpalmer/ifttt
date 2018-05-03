import Debug from '../lib/debug';

export const TOGGLE_LED = 'TOGGLE_LED';
export const SET_LEDS = 'SET_LEDS';

export function toggleLed(id, on) {
  Debug.log('Turning LED', id, ':', on);
  return {
    type: TOGGLE_LED,
    id,
    on,
  };
}

export function setLeds(leds) {
  Debug.log('LEDs', leds);
  return {
    type: SET_LEDS,
    leds,
  };
}
