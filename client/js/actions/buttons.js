import Debug from '../lib/debug';

export const SET_BUTTONS = 'SET_BUTTONS';

export function setButtons(buttons) {
  Debug.log('Buttons', buttons);
  return {
    type: SET_BUTTONS,
    buttons,
  };
}
