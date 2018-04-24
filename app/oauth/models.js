const OAuthAccessToken = require('./oauthaccesstoken.model.js');
const OAuthRefreshToken = require('./oauthrefreshtoken.model.js');
const OAuthAuthorizationCode = require('./oauthauthorizationcode.model.js');
const OAuthClient = require('./oauthclient.model.js');
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

module.exports.getAccessToken = (bearerToken) => {
  try {
    let dbt = Buffer.from(bearerToken, 'base64').toString().split(' ');
    console.log('getAccessToken - client ID: ', dbt[0], ' - secret: ', dbt[1]);
  } catch(e) {
    console.log('getAccessToken - bearerToken: ', bearerToken, ' - ')
  }

  return OAuthAccessToken
    .findOne({accessToken: bearerToken})
    .populate('user')
    .populate('client')
    .then(accessToken => {
      console.log('getAccessToken - fetched accessToken: ', accessToken)
      if (!accessToken) {
        return false;
      }
      console.log('getAccessToken - Returning: ', accessToken)
      return accessToken;
    })
    .catch(err => {
      console.log('getAccessToken - Err: ', err)
    });
}

module.exports.getClient = (clientId, clientSecret) => {
  console.log('getClient - ID:', clientId, '- clientSecret:', clientSecret)

  let filters = {id: clientId};
  if (clientSecret) {
    filters.secret = clientSecret;
  }

  return OAuthClient
    .findOne(filters)
    .then(client => {
      if (!client) {
        console.log('getClient - Client not found');
        return new Error('getClient - Client not found');
      }
      console.log('getClient - Returning: ', client);
      return client;
    }).catch(err => {
      console.log('getClient - Err: ', err)
    });
}


module.exports.getUser = (username, password) => {
  return User
    .findOne({email: username})
    .then(user => {
      console.log('getUser - User: ', user)
      let u = bcrypt.compareSync(password, user.password) ? user : false;
      console.log('getUser - Returning: ', u);
      return u;
    })
    .catch(err => {
      console.log('getUser - Err: ', err)
    });
}

module.exports.revokeAuthorizationCode = (code) => {
  console.log('revokeAuthorizationCode - code: ', code);
  return OAuthAuthorizationCode.findOne({authorizationCode: code.code})
    .then(rCode => {
      if(rCode) {
        rCode.remove();
      }
      /***
       * As per the discussion we need set older date
       * revokeToken will expected return a boolean in future version
       * https://github.com/oauthjs/node-oauth2-server/pull/274
       * https://github.com/oauthjs/node-oauth2-server/issues/290
       */
      var expiredCode = code
      expiredCode.expiresAt = new Date('2015-01-01T00:00:00.000Z')
      console.log('revokeAuthorizationCode - Returning: ', expiredCode);
      return expiredCode
    }).catch(err => {
      console.log('revokeAuthorizationCode - Err: ', err)
    });
}

module.exports.revokeToken = (token) => {
  console.log('revokeToken - token: ', token);
  return OAuthRefreshToken.findOne({refreshToken: token.refreshToken})
    .then(rT => {
      if (rT) {
        //rT.remove();
      }
      /***
       * As per the discussion we need set older date
       * revokeToken will expected return a boolean in future version
       * https://github.com/oauthjs/node-oauth2-server/pull/274
       * https://github.com/oauthjs/node-oauth2-server/issues/290
       */
      var expiredToken = token
      expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z')
      console.log('revokeToken - Returning: ', expiredToken);
      return expiredToken
    }).catch(err => {
      console.log('revokeToken - Err: ', err)
    });
}


module.exports.saveToken = (token, client, user) => {
  console.log('saveToken - token: ', token, ' - client: ', client, ' - user: ', user)
  return Promise.all([
      OAuthAccessToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        user: user._id,
        client: client._id,
      }),
      token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        user: user._id,
        client: client._id,
      }) : [],
    ])
    .then(() => {
      // TODO: This should pull in the actual generated objects, not the arguments
      let ret = Object.assign({}, token, {
        client,
        user
      });
      console.log('saveToken - Returning: ', ret);
      return ret;
    })
    .catch(err => {
      console.log('saveToken - Err: ', err)
    });
}

module.exports.getAuthorizationCode = (code) => {
  console.log('getAuthorizationCode - code: ', code);
  return OAuthAuthorizationCode
    .findOne({authorizationCode: code})
    .populate('user')
    .populate('client')
    .then(authCodeModel => {
      if (!authCodeModel) {
        console.log('getAuthorizationCode - Code not found');
        return false;
      }
      authCodeModel.code = authCodeModel.authorizationCode; // TODO: Is this needed?
      console.log('getAuthorizationCode - Returning: ', authCodeModel);
      return authCodeModel;
    }).catch(err => {
      console.log('getAuthorizationCode - Err: ', err)
    });
}

module.exports.saveAuthorizationCode = (code, client, user) => {
  console.log('saveAuthorizationCode - code: ', code, ' - client: ', client, ' - user: ', user);
  return OAuthAuthorizationCode
    .create({
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      scope: code.scope,
      redirectUri: client.redirectUris[0], // TODO: This needs to figure out which one?
      client: client._id,
      user: user._id,
    })
    .then((authCode) => {
      console.log('saveAuthorizationCode - Returning: ', authCode);
      return authCode;
    }).catch(err => {
      console.log('saveAuthorizationCode - Err: ', err)
    });
}

module.exports.getUserFromClient = (client) => {
  console.log('getUserFromClient - client: ', client);
  return OAuthClient
    .findOne({id: client.id})
    .populate('user')
    .then(client => {
      console.log('getUserFromClient - Fetched: ', client);
      if (!client || !client.user) {
        console.log('getUserFromClient - Client or user not found');
        return false;
      }
      console.log('getUserFromClient - Returning: ', client.user);
      return client.user;
    }).catch(err => {
      console.log('getUserFromClient - Err: ', err)
    });
}

module.exports.getRefreshToken = (refreshToken) => {
  console.log('getRefreshToken - refreshToken: ', refreshToken);
  if (!refreshToken || refreshToken === 'undefined') {
    return false; 
  }
  return OAuthRefreshToken
    .findOne({refreshToken: refreshToken})
    .populate('user')
    .populate('client')
    .then(refreshTokenModel => {
      console.log('getRefreshToken - Fetched: ', refreshTokenModel);
      if (!refreshTokenModel) {
        console.log('getRefreshToken - Token not found');
        return false;
      }
      console.log('getRefreshToken - Returning: ', refreshTokenModel);
      return refreshTokenModel;

    }).catch(err => {
      console.log('getRefreshToken - Err: ', err)
    });
}

validateScope = (token, client, scope) => {
    console.log('validateScope', token, client, scope)
    return (user.scope === client.scope) ? scope : false // TODO: Compare scope lists
}

module.exports.verifyScope = (token, scope) => {
  console.log('verifyScope', token, scope)
  let valid = token.scope === scope; // TODO: Compare scope lists
  console.log('verifyScope - valid:', valid);
  return valid;
}

