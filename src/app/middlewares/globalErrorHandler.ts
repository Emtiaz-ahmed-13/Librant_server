import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("from global error handler", err);

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(409).json({
      success: false,
      message: `Duplicate value: ${value} for ${field} field. This ${field} is already in use.`,
      error: {
        code: err.code,
        field,
        value,
      },
    });
  }

  // Default error handling
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  const errorResponse = {
    success: false,
    message,
    error:
      process.env.NODE_ENV === "production"
        ? { statusCode, message }
        : {
            statusCode,
            message,
            stack: err.stack,
            details: err,
          },
  };

  return res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
