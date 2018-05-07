import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { View, Spinner, Header } from 'native-base';
import Layout from '../layout';
import style from './style';
import { toggleLed } from '../../actions/leds';
import LoginImage from '../../../images/login.png';

const Splash = () => (
  <Layout noHeader contentContainerStyle={style.contentContainer}>
    <Header androidStatusBarColor="#5b7d87" style={{ display: 'none' }} />
    <View style={style.imageContainer}>
      <Image style={style.image} source={LoginImage} />
    </View>
    <Spinner color="white" />
  </Layout>
);

const mapStateToProps = state => ({
  leds: state.leds.leds,
});

const bindActions = dispatch => ({
  toggleLed: (id, on) => dispatch(toggleLed(id, on)),
});

export default connect(mapStateToProps, bindActions)(Splash);
