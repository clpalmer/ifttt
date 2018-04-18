import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NavBarItem extends React.Component {
  onClick(e) {
    if (typeof(this.props.action) === 'function') {
      this.props.action(e);
    }
    this.props.closeMenu(e);
  }

  render() {
    let liAttrs = {};
    if (this.props.position === 'right') {
      liAttrs.className = 'right';
    }
    if (this.props.to || this.props.action) {
      liAttrs.className = (liAttrs.className || '') + ' clickable';
    }
    if (this.props.icon) {
      liAttrs.className = (liAttrs.className || '') + ' icon';
    }

    let content = this.props.children;
    if (this.props.icon) {
      content = <div><div className={'icon--' + this.props.icon}></div><span className="icon-text">{content}</span></div>;
    }
    if (this.props.to) {
      content = <Link to={this.props.to}>{content}</Link>;
    }
    return (
      <li {...liAttrs} onClick={(e) => {this.onClick(e);}}>{content}</li>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.closeMenu = this.closeMenu.bind(this);

    this.state = {
      menuOpen: false,
    };
  }

  closeMenu(e) {
    if (this.state.menuOpen) {
      e.stopPropagation();

      this.setState({
        menuOpen: false,
      });
    }
  }

  toggleMenu(e) {
    e.stopPropagation();

    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  render() {
    let nlStyle = {};
    if (this.state.menuOpen) {
      nlStyle.maxHeight = (43 * this.props.children.length) + 'px';
    }

    let leftChildren = [];
    let rightChildren = [];
    let i = 0;
    React.Children.forEach(this.props.children, (child) => {
      if (child) {
        if (
          typeof(child.props.authenticated) === 'undefined' ||
          (child.props.authenticated && this.props.user.loggedIn) ||
          (!child.props.authenticated && !this.props.user.loggedIn)
        ) {
          let newChild = React.cloneElement(child, {key: i++, closeMenu: (e) => {this.closeMenu(e);}});
          if (child.props && child.props.right) {
            rightChildren.push(newChild);
          } else {
            leftChildren.push(newChild);
          }
        }
      }
    }, this);

    return (
      <ul className="navbar">
        <div className={'navbackground' + (this.state.menuOpen ? ' open' : '')}  onClick={(e) => {this.closeMenu(e);}}></div>
        <div className="container">
          <div className="navrow">
            <div className="naviconcontainer" onClick={(e) => {this.toggleMenu(e);}}><div className="navicon"></div></div>
            <div className={'navlinks' + (this.state.menuOpen ? ' open' : '')} style={nlStyle}>
              {leftChildren}
              <div className="navbarright">
                {rightChildren}
              </div>
            </div>
          </div>
        </div>
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    reduxState: state,
  };
};

const ConnectedNavBar = connect(mapStateToProps)(NavBar);

export {
  ConnectedNavBar as NavBar,
  NavBarItem,
};