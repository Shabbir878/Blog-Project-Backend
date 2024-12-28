// import mongoose from 'mongoose';
// import { TErrorSource, TGenericErrorResponse } from '../interface/error';

// const handleValidationError = (
//   error: mongoose.Error.ValidationError,
// ): TGenericErrorResponse => {
//   const errorSources: TErrorSource = Object.values(error.errors).map(
//     (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
//       return {
//         path: val?.path,
//         message: val?.message,
//       };
//     },
//   );

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorSources,
//   };
// };

// export default handleValidationError;

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
    stack: error.stack,
  };
};

export default handleValidationError;
