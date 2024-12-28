// import mongoose from 'mongoose';
// import { TErrorSource, TGenericErrorResponse } from '../interface/error';

// const handleCastError = (
//   error: mongoose.Error.CastError,
// ): TGenericErrorResponse => {
//   const errorSources: TErrorSource = [
//     {
//       path: error.path,
//       message: error.message,
//     },
//   ];
//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Invalid ID',
//     errorSources,
//   };
// };

// export default handleCastError;

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
    error: {
      details: errorSources, // Include formatted error details
    },
    stack: error.stack, // Add stack trace for debugging
  };
};

export default handleCastError;
