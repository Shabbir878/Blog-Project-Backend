import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { ILoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const register = async (payload: IUser) => {
  // Assign a default role if not provided
  payload.role = payload.role || 'user';

  // console.log('Role in Payload:', payload.role);

  // Check if the user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, 'User already exists');
  }

  // Create new user
  const newUser = await User.create(payload);
  // console.log('Saved User:', newUser);

  // Return only necessary fields
  const { _id, name, email } = newUser;

  return { _id, name, email };
};

const login = async (payload: ILoginUser) => {
  // Check if the user exists
  const user = await User.isUserEmailExists(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }

  // Verify the password
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  // Check user ID before proceeding
  if (!user._id) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Unexpected error: User ID is undefined',
    );
  }

  // Create JWT payload and token
  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    data: {
      token: accessToken,
    },
  };
};

export const AuthServices = {
  register,
  login,
};
