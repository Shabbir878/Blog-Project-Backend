import { ZodError, ZodIssue } from 'zod';
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const details: TErrorSource = error.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1],
    message: issue.message,
  }));

  return {
    success: false,
    message: 'Zod Validation Error',
    statusCode: 400,
    errorDetails: details,
    error: {
      details,
    },
    stack: error.stack,
  };
};

export default handleZodError;
