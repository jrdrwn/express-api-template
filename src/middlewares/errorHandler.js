const debug = require('debug')('server:error-handler');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const ApiError = require('../utils/ApiError');

exports.nextError = (_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
};

exports.errorConverter = (err, _req, _res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }
  next(error);
};

exports.errorHandler = (err, _req, res, _next) => {
  let { statusCode, message } = err;

  if (process.env.NODE_ENV === 'production') {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    debug(err);
  }

  res.status(statusCode).send(response);
};
