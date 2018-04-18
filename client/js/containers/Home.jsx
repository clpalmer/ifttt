import React from 'react';
import { connect } from 'react-redux';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import Authentication from '../components/Authentication';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loginError: false,
      usernameError: false,
      passwordError: false,
      submitting: false,
    };
  }
  onInputChange(e, input) {
    let newState = {
      [input.name]: input.value,
    };

    if (input.name === 'username') {
      newState.usernameError = false;
    } else if (input.name === 'password') {
      newState.passwordError = false;
    }

    this.setState(newState);
  }
  login(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.state.username || !this.state.password) {
      this.setState({
        usernameError: !this.state.username,
        passwordError: !this.state.password,
      });
    } else {
      this.setState({
        submitting: true,
        loginError: false,
        usernameError: false,
        passwordError: false,
      });

      Authentication.login(this.state.username, this.state.password, (result) => {
        this.setState({
          loginError: !result,
          submitting: false,
        });
      });
    }
  }
  logout() {
    Authentication.logout();
  }
  render() {
    return (
      <div>
        <div style={{padding: '30px 0', textAlign: 'center', fontSize: '28px'}}>Home</div>
        <div style={{border: '1px solid #cccccc', borderRadius: '5px', padding: '20px'}}>
          {
            this.props.user.loggedIn &&
            <span onClick={() => {this.logout();}}>Welcome {this.props.user.fullName}</span>
          }
          {
            !this.props.user.loggedIn &&
            <Form onSubmit={this.login.bind(this)}>
              <Form.Field disabled={this.state.submitting} error={this.state.usernameError}>
                <label>Username</label>
                <Input name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.onInputChange.bind(this)} />
              </Form.Field>
              <Form.Field disabled={this.state.submitting} error={this.state.passwordError}>
                <label>Password</label>
                <Input name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={this.onInputChange.bind(this)}/>
              </Form.Field>
              {
                this.state.loginError &&
                <Message negative><p>Invalid username or password</p></Message>
              }
              <div className="align-right">
                <Button disabled={this.state.submitting} loading={this.state.submitting} className="right" type="submit" basic primary>Sign In</Button> 
              </div>
            </Form>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    reduxState: state,
  };
};

const ConnectedHome = connect(mapStateToProps)(Home);
export default ConnectedHome;