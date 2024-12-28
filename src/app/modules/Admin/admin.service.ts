import { Blog } from '../Blog/blog.model';
import { User } from '../User/user.model';

const blockUserInDB = async (userId: string) => {
  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Block the user
  user.isBlocked = true;
  await user.save();

  // Return the user object directly
  return user;
};

const deleteBlogFromDB = async (id: string) => {
  // console.log('Deleting blog with ID:', id);

  if (!id) {
    throw new Error('Blog ID is required');
  }

  // Check if the blog exists
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }

  // Delete the blog
  await Blog.findByIdAndDelete(id);

  // Return the blogId directly
  return { id, message: 'Blog deleted successfully' };
};

export const AdminServices = {
  blockUserInDB,
  deleteBlogFromDB,
};
