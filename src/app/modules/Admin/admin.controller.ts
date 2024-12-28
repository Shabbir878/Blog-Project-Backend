import { StatusCodes } from 'http-status-codes';
import { AdminServices } from './admin.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await AdminServices.blockUserInDB(userId);

  sendResponse(res, {
    success: true,
    message: 'User blocked successfully',
    statusCode: StatusCodes.OK,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;

  await AdminServices.deleteBlogFromDB(id);

  sendResponse(res, {
    success: true,
    message: 'Blog deleted successfully',
    statusCode: StatusCodes.OK,
  });
});

export const AdminControllers = {
  blockUser,
  deleteBlog,
};
