import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch } from 'react-native';
import { Text, Body, Left, Right, ListItem, List, Icon } from 'native-base';
import Layout from '../layout';
import style from './style';
import { toggleLed } from '../../actions/leds';
import Debug from '../../lib/debug';

class Leds extends React.Component {
  static propTypes = {
    leds: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      pin: PropTypes.number.isRequired,
      onValue: PropTypes.number.isRequired,
    })),
    toggleLed: PropTypes.func.isRequired,
  }

  static defaultProps = {
    leds: [],
  }

  toggleLed(id, value) {
    Debug.log('Calling toggleLed');
    this.props.toggleLed(id, value);
  }
  render() {
    const listItems = [];
    Debug.log('Checking leds:', this.props.leds);
    if (Array.isArray(this.props.leds)) {
      this.props.leds.forEach((led) => {
        const li = (
          <ListItem icon key={`led_${led.id}`}>
            <Left>
              <Icon name="power" style={led.on ? style.ledOn : style.ledOff} />
            </Left>
            <Body>
              <Text>{led.name} - {led.pin} - {led.onValue}</Text>
            </Body>
            <Right>
              <Switch value={led.on} onValueChange={() => this.toggleLed(led.id, !led.on)} />
            </Right>
          </ListItem>
        );
        listItems.push(li);
      });
    }

    return (
      <Layout tab="buttons">
        <List>
          {listItems}
        </List>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  leds: state.leds.leds,
});

const bindActions = dispatch => ({
  toggleLed: (id, on) => dispatch(toggleLed(id, on)),
});

export default connect(mapStateToProps, bindActions)(Leds);
