import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Body, Left, Right, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { openDrawer, closeDrawer } from '../../actions/drawer';

import AppFooter from '../../components/appfooter';
import style from './style';

const Layout = props => {
  let header = null;
  if (!props.noHeader) {
    header = <Header>
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
      </Header>;
  }

  let footer = null;
  if (props.tab) {
    footer = <AppFooter tab={props.tab} />;
  }
  return (
    <Container>
      {header}
      <Content padder contentContainerStyle={props.contentContainerStyle}>
        {props.children}
      </Content>
      {footer}
    </Container>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  tab: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  noHeader: PropTypes.bool,
  contentContainerStyle: PropTypes.object,
};

Layout.defaultProps = {
  children: [],
  tab: '',
  noHeader: false,
  contentContainerStyle: {},
};

const mapStateToProps = state => ({
  drawerOpen: state.drawer.drawerOpen,
});

const bindActions = dispatch => ({
  openDrawer: () => dispatch(openDrawer()),
  closeDrawer: () => dispatch(closeDrawer()),
});

export default connect(mapStateToProps, bindActions)(Layout);
