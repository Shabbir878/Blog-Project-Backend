import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSource = [
    {
      path: error.path, // Path causing the error
      message: error.message, // Mongoose's error message
    },
  ];

  return {
    success: false,
    message: 'Invalid ID',
    statusCode: 400,
    errorDetails: errorSources, // Add missing errorDetails property
    error: {
      details: errorSources, // Include formatted error details
    },
    stack: error.stack, // Add stack trace for debugging
  };
};

export default handleCastError;
