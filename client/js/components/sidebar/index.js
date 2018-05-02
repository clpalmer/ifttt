import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Icon, Container, Left, Right, Badge } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { closeDrawer } from '../../actions/drawer';
import styles from './style';

const datas = [
  {
    name: 'LEDs',
    route: 'leds',
    icon: 'bulb',
    bg: '#DA4437',
  },
  {
    name: 'Buttons',
    route: 'buttons',
    icon: 'disc',
    bg: '#1EBC7C',
  },
];
const SideBar = props => (
  <Container>
    <Content
      bounces={false}
      style={{ flex: 1, backgroundColor: '#fff', top: -1 }}
    >
      <List
        dataArray={datas}
        renderRow={data =>
          (
            <ListItem
              button
              noBorder
              onPress={() => { Actions[data.route](); props.closeDrawer(); }}
            >
              <Left>
                <Icon active name={data.icon} style={{ color: '#777', fontSize: 26, width: 30 }} />
                <Text style={styles.text}>{data.name}</Text>
              </Left>
              {(data.types) &&
              <Right style={{ flex: 1 }}>
                <Badge
                  style={{
                    borderRadius: 3,
                    height: 25,
                    width: 72,
                    backgroundColor: data.bg,
                  }}
                >
                  <Text style={styles.badgeText}>{`${data.types} Types`}</Text>
                </Badge>
              </Right>
              }
            </ListItem>
          )
        }
      />
    </Content>
  </Container>
);

SideBar.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
};

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
  };
}

export default connect(null, bindAction)(SideBar);
