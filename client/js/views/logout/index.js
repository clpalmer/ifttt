import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Layout from '../layout';
import style from './style';
import { loggedOut } from '../../actions/session';

class Logout extends React.Component {
  static propTypes = {
    loggedOut: PropTypes.func.isRequired,
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.reset('leds');
      this.props.loggedOut();
    }, 1000);
  }

  render() {
    return (
      <Layout noHeader contentContainerStyle={style.contentContainer}>
        <Text style={style.text}>Signing out...</Text>
        <Spinner color="white" />
      </Layout>
    );
  }
}

const bindActions = dispatch => ({
  loggedOut: () => dispatch(loggedOut()),
});

export default connect(null, bindActions)(Logout);
