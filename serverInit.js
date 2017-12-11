/**
 * Module dependencies.
 */
var debug = require('debug')('spot-graphql-server:server');
var http = require('http');

require('dotenv/config');

const app = require('./app');

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4000';
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */
app.on('error', onError);
app.listen(port, () => {
  console.log(`listen on ${port}`);
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port $port requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port $port is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
