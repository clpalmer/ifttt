import React from 'react';
import { Actions } from 'react-native-router-flux';
import { Button, Footer, FooterTab, Text, Icon } from 'native-base';

import styles from './styles';

export default class AppFooter extends React.Component {
  render() {
    const isActive = tabName => (
      Actions.currentScene === tabName
    );

    return (
      <Footer>
        <FooterTab>
          <Button active={isActive('leds')} onPress={() => Actions.leds()} >
            <Icon active={isActive('leds')} name="bulb" />
            <Text>LEDs</Text>
          </Button>
          <Button active={isActive('buttons')} onPress={() => Actions.buttons()} >
            <Icon active={isActive('buttons')} name="disc" />
            <Text>Buttons</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
