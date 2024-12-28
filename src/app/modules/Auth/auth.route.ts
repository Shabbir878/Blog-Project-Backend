import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidations.signUpValidation),
  AuthControllers.register,
);

router.post(
  '/login',
  validateRequest(AuthValidations.logInValidation),
  AuthControllers.login,
);

export const AuthRoutes = router;
