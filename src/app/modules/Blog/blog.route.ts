import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { BlogValidations } from './blog.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { BlogControllers } from './blog.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(BlogValidations.createBlogValidation),
  BlogControllers.createBlog,
);

router.get('/', BlogControllers.getAllBlog);

router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(BlogValidations.updateBlogValidation),
  BlogControllers.updateBlog,
);

router.delete('/:id', auth(USER_ROLE.user), BlogControllers.deleteBlog);

export const BlogRoutes = router;
