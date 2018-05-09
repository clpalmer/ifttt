const OAuthAccessToken = require('./oauthaccesstoken.model.js');
const OAuthRefreshToken = require('./oauthrefreshtoken.model.js');
const OAuthAuthorizationCode = require('./oauthauthorizationcode.model.js');
const OAuthClient = require('./oauthclient.model.js');
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

const Debug = {
  log: (...args) => {
    console.log(...args);
  },
};

module.exports.getAccessToken = (bearerToken) => {
  try {
    let dbt = Buffer.from(bearerToken, 'base64').toString().split(' ');
    Debug.log('getAccessToken - client ID: ', dbt[0], ' - secret: ', dbt[1]);
  } catch(e) {
    Debug.log('getAccessToken - bearerToken: ', bearerToken, ' - ')
  }

  return OAuthAccessToken
    .findOne({accessToken: bearerToken})
    .populate('user')
    .populate('client')
    .then(accessToken => {
      Debug.log('getAccessToken - fetched accessToken: ', accessToken)
      if (!accessToken) {
        return false;
      }
      Debug.log('getAccessToken - Returning: ', accessToken)
      return accessToken;
    })
    .catch(err => {
      Debug.log('getAccessToken - Err: ', err)
    });
}

module.exports.getClient = (clientId, clientSecret) => {
  Debug.log('getClient - ID:', clientId, '- clientSecret:', clientSecret)

  let filters = {id: clientId};
  if (clientSecret) {
    filters.secret = clientSecret;
  }

  return OAuthClient
    .findOne(filters)
    .then(client => {
      if (!client) {
        Debug.log('getClient - Client not found');
        return new Error('getClient - Client not found');
      }
      Debug.log('getClient - Returning: ', client);
      return client;
    }).catch(err => {
      Debug.log('getClient - Err: ', err)
    });
}


module.exports.getUser = (username, password) => {
  return User
    .findOne({email: username})
    .then(user => {
      Debug.log('getUser - User: ', user)
      let u = bcrypt.compareSync(password, user.password) ? user : false;
      Debug.log('getUser - Returning: ', u);
      return u;
    })
    .catch(err => {
      Debug.log('getUser - Err: ', err)
    });
}

module.exports.revokeAuthorizationCode = (code) => {
  Debug.log('revokeAuthorizationCode - code: ', code);
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
      Debug.log('revokeAuthorizationCode - Returning: ', expiredCode);
      return expiredCode
    }).catch(err => {
      Debug.log('revokeAuthorizationCode - Err: ', err)
    });
}

module.exports.revokeToken = (token) => {
  Debug.log('revokeToken - token: ', token);
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
      Debug.log('revokeToken - Returning: ', expiredToken);
      return expiredToken
    }).catch(err => {
      Debug.log('revokeToken - Err: ', err)
    });
}


module.exports.saveToken = (token, client, user) => {
  Debug.log('saveToken - token: ', token, ' - client: ', client, ' - user: ', user)
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
      Debug.log('saveToken - Returning: ', ret);
      return ret;
    })
    .catch(err => {
      Debug.log('saveToken - Err: ', err)
    });
}

module.exports.getAuthorizationCode = (code) => {
  Debug.log('getAuthorizationCode - code: ', code);
  return OAuthAuthorizationCode
    .findOne({authorizationCode: code})
    .populate('user')
    .populate('client')
    .then(authCodeModel => {
      if (!authCodeModel) {
        Debug.log('getAuthorizationCode - Code not found');
        return false;
      }
      authCodeModel.code = authCodeModel.authorizationCode; // TODO: Is this needed?
      Debug.log('getAuthorizationCode - Returning: ', authCodeModel);
      return authCodeModel;
    }).catch(err => {
      Debug.log('getAuthorizationCode - Err: ', err)
    });
}

module.exports.saveAuthorizationCode = (code, client, user) => {
  Debug.log('saveAuthorizationCode - code: ', code, ' - client: ', client, ' - user: ', user);
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
      Debug.log('saveAuthorizationCode - Returning: ', authCode);
      return authCode;
    }).catch(err => {
      Debug.log('saveAuthorizationCode - Err: ', err)
    });
}

module.exports.getUserFromClient = (client) => {
  Debug.log('getUserFromClient - client: ', client);
  return OAuthClient
    .findOne({id: client.id})
    .populate('user')
    .then(client => {
      Debug.log('getUserFromClient - Fetched: ', client);
      if (!client || !client.user) {
        Debug.log('getUserFromClient - Client or user not found');
        return false;
      }
      Debug.log('getUserFromClient - Returning: ', client.user);
      return client.user;
    }).catch(err => {
      Debug.log('getUserFromClient - Err: ', err)
    });
}

module.exports.getRefreshToken = (refreshToken) => {
  Debug.log('getRefreshToken - refreshToken: ', refreshToken);
  if (!refreshToken || refreshToken === 'undefined') {
    return false; 
  }
  return OAuthRefreshToken
    .findOne({refreshToken: refreshToken})
    .populate('user')
    .populate('client')
    .then(refreshTokenModel => {
      Debug.log('getRefreshToken - Fetched: ', refreshTokenModel);
      if (!refreshTokenModel) {
        Debug.log('getRefreshToken - Token not found');
        return false;
      }
      Debug.log('getRefreshToken - Returning: ', refreshTokenModel);
      return refreshTokenModel;

    }).catch(err => {
      Debug.log('getRefreshToken - Err: ', err)
    });
}

validateScope = (token, client, scope) => {
    Debug.log('validateScope', token, client, scope)
    return (user.scope === client.scope) ? scope : false // TODO: Compare scope lists
}

module.exports.verifyScope = (token, scope) => {
  Debug.log('verifyScope', token, scope)
  let valid = token.scope === scope; // TODO: Compare scope lists
  Debug.log('verifyScope - valid:', valid);
  return valid;
}

