'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const routes = require('./routes');
const mongoose = require('mongoose');

// If is being tested locally, change it to 'mongodb://localhost:27017/shortio'
const mongoUri = process.env.MONGOURI || 'mongodb://localhost/shortio';

const options = {
  server: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  },
  replset: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  }
};

mongoose.connect(mongoUri, options);

const db = mongoose.connection;

server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
});

server.register(require('inert'), function(err) {
  db.on('error', console.error.bind(console, 'connection error:'))
    .once('open', function() {
      server.route(routes);

      server.start(function(err) {
        if (err) throw err;
        console.log(`Server running at port ${server.info.port}`)
      });
    });
});
