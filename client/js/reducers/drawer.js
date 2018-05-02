import { OPEN_DRAWER, CLOSE_DRAWER } from '../actions/drawer';

const initialState = {
  drawerOpen: false,
};

export default function (state = initialState, action) {
  if (action.type === OPEN_DRAWER) {
    return {
      ...state,
      drawerOpen: true,
    };
  }

  if (action.type === CLOSE_DRAWER) {
    return {
      ...state,
      drawerOpen: false,
    };
  }

  return state;
}
