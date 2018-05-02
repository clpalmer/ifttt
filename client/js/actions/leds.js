export const TOGGLE_LED = 'TOGGLE_LED';

export function toggleLed(id, on) {
  console.log('turning LED ',id,':',on)
  return {
    type: TOGGLE_LED,
    id,
    on,
  };
}
