import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Body, Left, Right, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { openDrawer, closeDrawer } from '../../actions/drawer';

import AppFooter from '../../components/appfooter';
import style from './style';

const Layout = props => (
  <Container>
    <Header>
      <Left>
        <Button
          transparent
          onPress={() => {
            if (props.drawerOpen) {
              props.closeDrawer();
            } else {
              props.openDrawer();
            }
          }}
        >
          <Icon name="menu" style={style.menuIcon} />
        </Button>
      </Left>
      <Body>
        <Title>{Actions.currentScene}</Title>
      </Body>
      <Right />
    </Header>
    <Content padder>
      {props.children}
    </Content>
    {
      props.tab &&
      <AppFooter tab={props.tab} />
    }
  </Container>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  tab: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

Layout.defaultProps = {
  children: [],
  tab: '',
};

const mapStateToProps = state => ({
  drawerOpen: state.drawer.drawerOpen,
});

const bindActions = dispatch => ({
  openDrawer: () => dispatch(openDrawer()),
  closeDrawer: () => dispatch(closeDrawer()),
});

export default connect(mapStateToProps, bindActions)(Layout);
