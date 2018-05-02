import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import Routes from './Routes';
import getTheme from '../theme/components';
import reducers from './reducers';

export default () => (
  <Provider store={createStore(reducers)}>
    <StyleProvider style={getTheme()}>
      <Routes />
    </StyleProvider>
  </Provider>
);
