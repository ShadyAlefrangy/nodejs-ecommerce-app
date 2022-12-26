/* eslint-disable arrow-body-style */
/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */

import { ApiError } from "../util/apiError.mjs";

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again.", 401);

const handleJwtExpiredToken = () =>
  new ApiError("Expired token, please login again.", 401);

export function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDevelopmentMode(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handleJwtInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      err = handleJwtExpiredToken();
    }
    sendErrorForProductionMode(err, res);
  }
}

const sendErrorForDevelopmentMode = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProductionMode = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
