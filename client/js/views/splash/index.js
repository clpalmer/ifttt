import React from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { Text, View, Spinner } from 'native-base';
import Layout from '../layout';
import style from './style';
import { toggleLed } from '../../actions/leds';
import Tux from '../../../images/tux-cartman.png';

const Splash = () => (
  <Layout noHeader contentContainerStyle={style.contentContainer}>
    <View style={style.imageContainer}>
      <Image style={style.image} source={Tux} /><Text style={style.text}>IFTTTNode</Text>
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
