import { StatusCodes } from 'http-status-codes';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');

    // checking if the token is missing
    if (!accessToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'You are not authorized to access this route',
      );
    }

    // checking if the token is valid
    const decoded = jwt.verify(
      accessToken,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    console.log('Decoded JWT:', decoded);
    const { id, role, email } = decoded;

    // checking if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // checking if the user has the required role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new Error('You are not Authorized');
    }

    // req.user = decoded as JwtPayload;
    req.user = { id, role, email };
    next();
  });
};

export default auth;
