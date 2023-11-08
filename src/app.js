"use strict";
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');



const app = express();





app.use(morgan.successHandler);
app.use(morgan.errorHandler);


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());



app.use('/', routes);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use((err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
      const statusCode =
        error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
  });

// handle error
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
  
    res.locals.errorMessage = err.message;
  
    const response = {
      statusCode: statusCode,
      suceess:false,
      message,
      ...(config.env === 'development' && { stack: err.stack }),
    };
  
    if (config.env === 'development') {
      logger.error(err);
    }
  
    res.status(statusCode).send(response);
  });

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port} on ${config.env}` );
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports = app;
