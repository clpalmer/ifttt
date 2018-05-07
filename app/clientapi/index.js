const http = require("http");
const url = require("url");
const WebSocket = require("ws");
const OAuthError = require('oauth2-server/lib/errors/oauth-error');
const Button = require('../models/button.model.js');
const ButtonPress = require('../models/buttonpress.model.js');
const Realtime = require('../ifttt/realtime.js');

let websocketServer = null;

module.exports = {
  init: (app) => {
    const server = http.createServer(app);
    websocketServer = new WebSocket.Server({
      server,
      verifyClient: (info, cb) => {
        const parsedUrl = url.parse(info.req.url, true);

        if (!parsedUrl.query.token) {
          console.log('No token provided');
          return cb(false, 401, 'Unauthorized');
        }
        
        info.req.headers.Authorization = `Bearer ${parsedUrl.query.token}`;
        const res = {
          locals: {},
        };

        app.oauth.authenticate({scope: 'ifttt'})({
          headers: info.req.headers,
          query: {},
          method: 'GET',
        }, res, (e) => {
          if (e instanceof OAuthError) {
            console.log('Error: e:', e);
            return cb(false, 401, 'Unauthorized');
          }
          try {
            info.req.user = res.locals.oauth.token.user;
          } catch(e) {
            console.log('user not found');
            return cb(false, 401, 'Unauthorized');
          }
          cb(true);
        });
      }
    });

    const noop = () => {};

    websocketServer.on('connection', (client, req) => {
      client._iftttData = {
        user: req.user,
        isAlive: true,
      };

      client.on('pong', () => {
        client._iftttData.isAlive = true;
      });

      client.on('message', (message) => {
        try {
          message = JSON.parse(message);
        } catch (e) {
          return client.send(JSON.stringify({error: 'Expected JSON message'}));
        }

        if (typeof(message) !== 'object' || !message.type) {
          return client.send(JSON.stringify({error: 'Expected object with type'}));
        }
        
        if (message.type === 'buttonPress') {
          if (!message.data || !message.data.id) {
            return client.send(JSON.stringify({error: 'Invalid buttonPress data'}));
          }
          Button.findOne({id: message.data.id}).then((button) => {
            if (!button) {
              return client.send(JSON.stringify({error: 'Button not found'}));
            }
            ButtonPress.create({
              button: button._id,
            }).then((buttonpress) => {
              buttonpress.button = button;
              Realtime.notifyButtonPress(button);
              return client.send(JSON.stringify(buttonpress));
            }).catch((err) => {
              return client.send(JSON.stringify({error: 'Error creating button press', message: err}));
            });
          }).catch((err) => {
            return client.send(JSON.stringify({error: 'Error finding button', message: err}));
          });
        }
      });

      
      client.send(JSON.stringify({
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        }
      }));
    });

    const interval = setInterval(function ping() {
      websocketServer.clients.forEach((client) => {
        if (!client._iftttData.isAlive) {
          return client.terminate();
        }

        client._iftttData.isAlive = false;
        client.ping(noop);
      });
    }, 30000);

    server.listen(3002, () => {
      console.log('Websocket server started on port 3002');
    });
  },
  action: (type, data) => {
    websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify({
        type,
        data,
      }));
    })
  },
};