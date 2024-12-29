import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { ILoginUser } from './auth.interface';
import { createToken } from './auth.utils';

// const register = async (payload: IUser) => {
//   console.log('Incoming Payload:', payload);

//   // Check if the role exists in the incoming payload
//   console.log('Role in Payload:', payload.role);
//   // user existence check
//   const user = await User.findOne({ email: payload.email });

//   if (user) {
//     throw new Error('User already exists');
//   }

//   const newUserPayload = {
//     ...payload,
//     role: payload.role, // Use role as provided in the payload
//   };

//   console.log('Payload to be saved:', newUserPayload);
//   // create new user
//   const newUser = await User.create(newUserPayload);
//   console.log('Saved User:', newUser);
//   const { _id, name, email, role } = newUser;

//   return {
//     data: {
//       _id,
//       name,
//       email,
//       role,
//     },
//   };
// };

// const register = async (payload: IUser) => {
//   console.log('Incoming Payload:', payload);

//   // Ensure the role exists or assign the default value
//   if (!payload.role) {
//     payload.role = 'user'; // Assign a default role if none exists
//   }

//   console.log('Role in Payload:', payload.role); // Check role after assigning it explicitly

//   // Check if the user already exists
//   const user = await User.findOne({ email: payload.email });

//   if (user) {
//     throw new Error('User already exists');
//   }

//   const newUserPayload = {
//     ...payload,
//     role: payload.role, // Ensure role is passed in payload
//   };

//   console.log('Payload to be saved:', newUserPayload);

//   // Create new user
//   const newUser = await User.create(newUserPayload);
//   console.log('Saved User:', newUser);

//   const { _id, name, email } = newUser;

//   return {
//     data: {
//       _id,
//       name,
//       email,
//     },
//   };
// };

const register = async (payload: IUser) => {
  // Ensure the role exists or assign the default value
  payload.role = payload.role || 'user';

  console.log('Role in Payload:', payload.role);

  // Check if the user already exists
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error('User  already exists');
  }

  // Create new user
  const newUser = await User.create(payload);
  console.log('Saved User:', newUser);

  // Destructure only the necessary fields for the response
  const { _id, name, email } = newUser;

  return {
    _id,
    name,
    email,
  };
};

// const login = async (payload: ILoginUser) => {
//   // Using static method to check if the email exists
//   const user = await User.isUserEmailExists(payload.email);

//   if (!user) {
//     throw new Error('User not found');
//   }

//   // Using static method to check if the password is matched
//   const isPasswordMatched = await User.isPasswordMatched(
//     payload.password,
//     user.password,
//   );

//   if (!isPasswordMatched) {
//     throw new Error('Invalid password');
//   }

//   // create jwt payload & token
//   if (!user || !user._id) {
//     throw new Error('User ID is undefined');
//   }

//   const jwtPayload = {
//     id: user._id.toString(),
//     email: user.email,
//     role: user.role,
//   };

//   // console.log('JWT Payload:', jwtPayload); // Check the payload structure

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   // console.log('Generated Token:', accessToken); // Check the generated token

//   return {
//     data: {
//       token: accessToken,
//     },
//   };
// };

const login = async (payload: ILoginUser) => {
  // Using static method to check if the email exists
  const user = await User.isUserEmailExists(payload.email);

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found');
  }

  // Using static method to check if the password is matched
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  // create jwt payload & token
  if (!user || !user._id) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'User ID is undefined',
    );
  }

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
