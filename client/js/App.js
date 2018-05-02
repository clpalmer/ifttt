import React from 'react';
import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Routes from './Routes';
import getTheme from '../theme/components';
import { persistor, store } from './lib/store';
import Splash from './views/splash';

export default () => (
  <Provider store={store}>
    <StyleProvider style={getTheme()}>
      <PersistGate loading={<Splash />} persistor={persistor}>
        <Routes />
      </PersistGate>
    </StyleProvider>
  </Provider>
);
