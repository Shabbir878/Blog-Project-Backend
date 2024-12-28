//  import { TErrorSource, TGenericErrorResponse } from '../interface/error';

// import { TGenericErrorResponse } from "../interface/error";

//  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  const handleDuplicateError = (error: any): TGenericErrorResponse => {
// //   // Extract value within double quotes using regex
//   const match = error.message.match(/"([^"]*)"/);

// //   // The extracted value will be in the first capturing group
//    const extractedMessage = match && match[1];

//   const errorSources: TErrorSource = [
//      {
//        path: '',
//        message: `${extractedMessage} is already exists`,
//      },
//    ];

//    const statusCode = 400;

//    return {
//      statusCode,
//      message: 'Invalid ID',
//      errorSources,
//    };
//  };

//  export default handleDuplicateError;

import { TErrorSource, TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: '', // The path causing the error, adjust as needed
      message: `${extractedMessage} already exists.`,
    },
  ];

  return {
    success: false,
    message: 'Duplicate Entry',
    statusCode: 400,
    error: {
      details: errorSources,
    },
    stack: error.stack, // Include stack trace for debugging
  };
};

export default handleDuplicateError;
