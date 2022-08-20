const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('./config/logger');
const pino = require('express-pino-logger')({ logger });

const { nextError, errorConverter, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(pino);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(nextError);
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
