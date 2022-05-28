const ApiError = require('../utils/ApiError');
const debug = require('debug')('server:error-handler');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

exports.errorConverter = (err, req, res, next) => {
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

exports.errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (process.env.NODE_ENV === 'prod') {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'dev') {
        debug(err);
    }

    res.status(statusCode).send(response);
};
