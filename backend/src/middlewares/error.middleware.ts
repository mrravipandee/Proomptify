import { Request, Response, NextFunction } from 'express';
import { ApiError, sendErrorResponse } from '../utils/response';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return sendErrorResponse(res, err.message, err.statusCode);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return sendErrorResponse(
      res,
      err.message,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return sendErrorResponse(
      res,
      ERROR_MESSAGES.USER_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendErrorResponse(
      res,
      ERROR_MESSAGES.INVALID_TOKEN,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (err.name === 'TokenExpiredError') {
    return sendErrorResponse(
      res,
      ERROR_MESSAGES.INVALID_TOKEN,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Default server error
  return sendErrorResponse(
    res,
    ERROR_MESSAGES.SERVER_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  sendErrorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};
