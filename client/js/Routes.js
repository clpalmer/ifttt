import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleProvider, Drawer } from 'native-base';
import { Router, Scene, Reducer } from 'react-native-router-flux';

import getTheme from '../theme/components';
import { closeDrawer } from './actions/drawer';

import Leds from './views/leds';
import Buttons from './views/buttons';
import Splash from './views/splash';
import Login from './views/login';
import Logout from './views/logout';

import SideBar from './components/sidebar';
import IFTTTApi from './lib/iftttapi';
import Debug from './lib/debug';

const reducerCreate = (params) => {
  const defaultReducer = new Reducer(params);
  return (state, action) => (
    defaultReducer(state, action)
  );
};
const ConnectedRouter = connect(state => ({ state: state.route }))(Router);

class Routes extends Component {
  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
    session: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      accessToken: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    Debug.log('Calling init');
    IFTTTApi.init();
  }

  componentDidUpdate() {
    if (this.props.drawerOpen) {
      this.openDrawer();
    } else {
      this._drawer._root.close();
    }
  }

  openDrawer() {
    this._drawer._root.open();
  }

  closeDrawer() {
    if (this.props.drawerOpen) {
      this.props.closeDrawer();
    }
  }
  render() {
    let content = null;
    if (this.props.session.loading) {
      content = <Splash />;
    } else if (!this.props.session.accessToken) {
      content = <Login />;
    } else {
      content = (
        <ConnectedRouter
          createReducer={reducerCreate}
          backAndroidHandler={() => {}}
        >
          <Scene key="root">
            <Scene key="leds" hideNavBar component={Leds} initial />
            <Scene key="buttons" hideNavBar component={Buttons} />
            <Scene key="logout" hideNavBar component={Logout} />
          </Scene>
        </ConnectedRouter>
      );
    }
    return (
      <StyleProvider style={getTheme()}>
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          content={<SideBar navigator={this._navigator} />}
          onClose={() => this.closeDrawer()}
        >
          {content}
        </Drawer>
      </StyleProvider>
    );
  }
}

const bindAction = dispatch => ({
  closeDrawer: () => dispatch(closeDrawer()),
});

const mapStateToProps = state => ({
  drawerOpen: state.drawer.drawerOpen,
  session: state.session,
});

export default connect(mapStateToProps, bindAction)(Routes);
