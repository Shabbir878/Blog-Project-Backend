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

    // Check if the token is missing
    if (!accessToken) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Authentication token is missing or invalid',
      );
    }

    // Verify the token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        accessToken,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
    }

    //console.log('Decoded JWT:', decoded);

    const { id, role, email } = decoded;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'User associated with this token no longer exists',
      );
    }

    // Check if the user has the required role
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to access this resource',
      );
    }

    // Attach the user to the request object
    req.user = { id, role, email };
    next();
  });
};

export default auth;
