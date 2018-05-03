import { SET_BUTTONS } from '../actions/buttons';

const initialState = {
  buttons: [
    {
      id: '12345',
      name: 'Button 1',
      pin: 4,
    },
    {
      id: '23456',
      name: 'Button 2',
      pin: 8,
    },
  ],
};

export default function (state = initialState, action) {
  if (action.type === SET_BUTTONS) {
    return {
      buttons: action.buttons,
    };
  }

  return state;
}
