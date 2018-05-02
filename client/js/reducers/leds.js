import { TOGGLE_LED } from '../actions/leds';

const initialState = {
  leds: [
    {
      id: '12345',
      name: 'Green LED',
      onValue: 1,
      pin: 4,
      on: false,
    },
    {
      id: '23456',
      name: 'Blue LED',
      onValue: 0,
      pin: 8,
      on: true,
    },
  ],
};

export default function (state = initialState, action) {
  if (action.type === TOGGLE_LED) {
    const leds = [];
    state.leds.forEach((led) => {
      const l = led;
      if (l.id === action.id) {
        l.on = action.on;
      }
      leds.push(l);
    });
    return {
      ...state,
      leds,
    };
  }

  return state;
}
