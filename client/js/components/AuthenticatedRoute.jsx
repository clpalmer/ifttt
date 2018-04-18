import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthenticatedRoute = ({ user, component: Component, ...rest }) => (
  <Route {...rest} render={(props) =>
    user.loggedIn ?
      <Component {...props} /> :
      <Redirect to={{ pathname: '/' }} />
  }/>
);

const mapStateToProps = (state) => {
  return {
    user: state.user,
    reduxState: state,
  };
};

const ConnectedAuthenticatedRoute = withRouter(connect(mapStateToProps)(AuthenticatedRoute));
export default ConnectedAuthenticatedRoute;