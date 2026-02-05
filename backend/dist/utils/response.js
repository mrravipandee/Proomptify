"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.sendErrorResponse = exports.sendSuccessResponse = exports.ApiError = void 0;
const constants_1 = require("../constants");
class ApiError extends Error {
    constructor(message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const sendSuccessResponse = (res, data, message = 'Success', statusCode = constants_1.HTTP_STATUS.OK) => {
    const response = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, error) => {
    const response = {
        success: false,
        message,
        error,
    };
    return res.status(statusCode).json(response);
};
exports.sendErrorResponse = sendErrorResponse;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
