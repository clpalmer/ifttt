import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Text } from 'native-base';
import Layout from '../layout';
import style from './style';
import { toggleLed } from '../../actions/leds';
import Debug from '../../lib/debug';
import IFTTTApi from '../../lib/iftttapi';

const pressButton = (id) => {
  Debug.log('Pressing button:', id);
  IFTTTApi.pressButton(id);
};

const Buttons = (props) => {
  const buttons = [];
  Debug.log('Checking buttons:', props.buttons);
  if (Array.isArray(props.buttons)) {
    props.buttons.forEach((b) => {
      const button = (
        <Button block key={`button_${b.id}`} style={style.button} onPress={() => { pressButton(b.id); }}><Text>{b.name}</Text></Button>
      );
      buttons.push(button);
    });
  }

  return (
    <Layout tab="buttons">
      {buttons}
    </Layout>
  );
};

Buttons.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })),
};

Buttons.defaultProps = {
  buttons: [],
};

const mapStateToProps = state => ({
  buttons: state.buttons.buttons,
});

const bindActions = dispatch => ({
  toggleLed: (id, on) => dispatch(toggleLed(id, on)),
});

export default connect(mapStateToProps, bindActions)(Buttons);
