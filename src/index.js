const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const mongoose = require('mongoose');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

mongoose.connect(config.mongoose.url).catch((err) => {
  throw new Error(err);
});

app.set('port', config.port);
app.set('hostname', config.hostname);

const server = http.createServer(app);

const terminus_options = {
  signals: ['SIGINT', 'SIGBREAK', 'SIGHUP', 'SIGUSR2'],
  onSignal: () => {
    logger.info('server is starting cleanup');
    return Promise.all([mongoose.disconnect(), Promise.resolve(server.close())]);
  },
  onShutdown: () => {
    logger.info('cleanup finished, server is shutting down');
  },
};

createTerminus(server, terminus_options);

server.listen(config.port, config.hostname, () => {
  const addr = server.address();
  logger.info(`Listening on http://${addr.address}:${config.port}`);
});
