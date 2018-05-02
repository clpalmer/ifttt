let _debugEnabled = true;

const Debug = {
  setDebug(enabled) {
    _debugEnabled = enabled;
  },
  log: (...args) => {
    if (_debugEnabled) {
      console.log('[IFTTTNode] -', ...args); // eslint-disable-line no-console
    }
  },
};

export default Debug;
