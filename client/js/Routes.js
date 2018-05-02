import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleProvider, Drawer } from 'native-base';
import { Router, Scene, Reducer, Actions } from 'react-native-router-flux';

import getTheme from '../theme/components';
import { closeDrawer } from './actions/drawer';

import Leds from './views/leds';
import Buttons from './views/buttons';

import SideBar from './components/sidebar';

const reducerCreate = (params) => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    //console.log('ACTION: ', action)
    return defaultReducer(state, action);
  };
};
const ConnectedRouter = connect(state => ({ state: state.route }))(Router);

class Routes extends Component {
  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
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
    return (
      <StyleProvider style={getTheme()}>
        <Drawer
          ref={(ref) => { this._drawer = ref; }}
          content={<SideBar navigator={this._navigator} />}
          onClose={() => this.closeDrawer()}
        >
          <ConnectedRouter
            createReducer={reducerCreate}
            backAndroidHandler={() => {}}
          >
            <Scene key="root">
              <Scene key="leds" hideNavBar component={Leds} initial />
              <Scene key="buttons" hideNavBar component={Buttons} />
            </Scene>
          </ConnectedRouter>
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
  scene: state.scene,
});

export default connect(mapStateToProps, bindAction)(Routes);
