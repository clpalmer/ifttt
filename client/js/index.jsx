/* global document, module */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import App from './containers/App';
import createStore from './reducers/store';
import Authentication from './components/Authentication';

let store = createStore();
Authentication.setStore(store);

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App/>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

render();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => { render(); });
}
