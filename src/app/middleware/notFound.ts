import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const NotFound = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Not Found',
    error: {
      details: 'The requested resource could not be found.',
    },
    stack: '',
  });
};

export default NotFound;
