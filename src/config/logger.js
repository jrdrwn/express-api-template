const pino = require('pino').default;
const config = require('./config');

module.exports = pino({
  transport: config.env !== 'production' && {
    target: 'pino-pretty',
  },
});
