import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavBar, NavBarItem } from '../components/NavBar';
import { userActions } from '../reducers/user';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import Home from './Home';
import Test from './Test';
import About from './About';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar>
            <NavBarItem to="/">Home</NavBarItem>
            <NavBarItem authenticated={true} to="/test">Authenticated Test</NavBarItem>
            <NavBarItem authenticated={true} right="true">{this.props.user.fullName}</NavBarItem>
            <NavBarItem authenticated={true} right="true" icon="signout" action={() => {this.props.dispatch(userActions.logout());}}>Sign Out</NavBarItem>
            <NavBarItem authenticated={false} to="/" right="true" icon="signin">Sign Out</NavBarItem>
            <NavBarItem to="/about" icon="help" right="true">About</NavBarItem>
          </NavBar>
          <div className="container">
            <Route exact path="/" component={Home}/>
            <AuthenticatedRoute path="/test" component={Test}/>
            <Route path="/about" component={About}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    reduxState: state,
  };
};

const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;