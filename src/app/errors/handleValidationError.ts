import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const details: TErrorSource = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val?.path,
      message: val?.message,
    }),
  );

  return {
    success: false,
    message: 'Validation Error',
    statusCode: 400,
    error: {
      details,
    },
    errorDetails: details,
    stack: error.stack,
  };
};

export default handleValidationError;
