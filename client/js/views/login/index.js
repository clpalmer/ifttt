import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { Text, Icon, View, Form, Item, Input, Button, Spinner } from 'native-base';
import Layout from '../layout';
import style from './style';
import { toggleLed } from '../../actions/leds';
import Tux from '../../../images/tux-cartman.png';
import IFTTTApi from '../../lib/iftttapi';

class Splash extends React.Component {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      emailActive: false,
      passwordActive: false,
      email: '',
      password: '',
      error: false,
      busy: false,
    };
  }

  onFocusEmail = () => {
    this.setState({
      emailActive: true,
    });
  }

  onFocusPassword = () => {
    this.setState({
      passwordActive: true,
    });
  }

  onBlur = () => {
    this.setState({
      emailActive: false,
      passwordActive: false,
    });
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onLogin = () => {
    this.setState({ busy: true }, () => {
      IFTTTApi.login(this.state.email, this.state.password).then(() => {
        Actions.leds();
      }).catch(() => {
        this.setState({
          error: true,
          busy: false,
        });
      });
    });
  }

  render() {
    return (
      <Layout noHeader contentContainerStyle={style.contentContainer}>
        <View style={style.imageContainer}>
          <Image style={style.image} source={Tux} /><Text style={style.text}>IFTTTNode</Text>
        </View>
        <Form>
          <Text style={style.errorText}>{this.state.error ? 'Login failed - Please try again' : ' '}</Text>
          <Item rounded style={{ marginBottom: 20 }}>
            <Icon active={this.state.emailActive} type="FontAwesome" name="user" style={{ color: (this.state.emailActive ? 'black' : 'grey') }} />
            <Input
              disabled={this.state.busy}
              keyboardType="email-address"
              placeholder="Email Address"
              value={this.state.email}
              onFocus={this.onFocusEmail}
              onBlur={this.onBlur}
              onChangeText={(v) => { this.onChange('email', v); }}
            />
          </Item>
          <Item rounded style={{ marginBottom: 20 }}>
            <Icon active={this.state.passwordActive} type="FontAwesome" name="lock" style={{ color: (this.state.passwordActive ? 'black' : 'grey') }} />
            <Input
              disabled={this.state.busy}
              secureTextEntry
              placeholder="Password"
              value={this.state.password}
              onFocus={this.onFocusPassword}
              onBlur={this.onBlur}
              onChangeText={(v) => { this.onChange('password', v); }}
            />
          </Item>
          <Button
            disabled={this.state.busy}
            block
            style={{ marginBottom: 20 }}
            onPress={this.onLogin}
          >
            {
              this.state.busy ?
              <Spinner color="white" /> :
              <Text>Sign In</Text>
            }
          </Button>
        </Form>
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

export default connect(mapStateToProps, bindActions)(Splash);
