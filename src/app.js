const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL).catch((err) => {
    throw new Error(err);
});

if (process.env.NODE_ENV !== 'prod') {
    app.use(logger('dev'));
}
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
