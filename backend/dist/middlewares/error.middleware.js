"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const constants_1 = require("../constants");
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err instanceof response_1.ApiError) {
        return (0, response_1.sendErrorResponse)(res, err.message, err.statusCode);
    }
    if (err.name === 'ValidationError') {
        return (0, response_1.sendErrorResponse)(res, err.message, constants_1.HTTP_STATUS.BAD_REQUEST);
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return (0, response_1.sendErrorResponse)(res, constants_1.ERROR_MESSAGES.USER_EXISTS, constants_1.HTTP_STATUS.CONFLICT);
    }
    if (err.name === 'JsonWebTokenError') {
        return (0, response_1.sendErrorResponse)(res, constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    if (err.name === 'TokenExpiredError') {
        return (0, response_1.sendErrorResponse)(res, constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.HTTP_STATUS.UNAUTHORIZED);
    }
    return (0, response_1.sendErrorResponse)(res, constants_1.ERROR_MESSAGES.SERVER_ERROR, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, process.env.NODE_ENV === 'development' ? err.message : undefined);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    (0, response_1.sendErrorResponse)(res, `Route ${req.originalUrl} not found`, constants_1.HTTP_STATUS.NOT_FOUND);
};
exports.notFoundHandler = notFoundHandler;
