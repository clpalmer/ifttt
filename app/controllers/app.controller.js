const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

module.exports.index = (req, res) => {
  return res.render('app/index', {user: req.session.user});
};

module.exports.login = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  return res.render('app/login');
};

module.exports.authenticate = (req, res) => {
  if (req.body.username && req.body.password) {
    User
      .findOne({email: req.body.username})
      .then(user => {
        if (!user) {
          return res.render('app/login', {error: 'Invalid credentials'});
        }
        console.log('getUser - User: ', user)
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            console.log('getUser - Setting req.session.user = user');
            req.session.user = user;
            if (req.query.redirect_uri) {
              return res.redirect(decodeURIComponent(req.query.redirect_uri));
            } else {
              return res.redirect('/');
            }
          } else {
            return res.render('app/login', {error: 'Invalid credentials'});
          }
        });
      })
      .catch(err => {
        console.log('getUser - Err: ', err)
        return res.render('app/login', {error: 'Internal Server Error'});
      });
  } else {
    return res.render('app/login', {error: 'Invalid credentials'});
  }
};

module.exports.logout = (req, res) => {
  req.session.destroy(err => {
    return res.redirect('/login');
  });
};