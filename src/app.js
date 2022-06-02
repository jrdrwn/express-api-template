const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('./config/morgan');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL).catch((err) => {
    throw new Error(err);
});

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
