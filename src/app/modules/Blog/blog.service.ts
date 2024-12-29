import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../User/user.model';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlogIntoDB = async (payload: IBlog) => {
  const { author, ...blogData } = payload;

  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start the transaction

    // Check if the author exists
    const isAuthorExist = await User.findById(author).session(session);
    if (!isAuthorExist) {
      throw new Error('Author is not found');
    }

    // Create the blog
    const blog = await Blog.create([{ ...blogData, author }], { session });
    const populatedBlog = await Blog.findById(blog[0]._id)
      .populate('author', 'name email')
      .session(session);

    if (!populatedBlog) {
      throw new Error('Failed to populate author details');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Format the result
    return {
      _id: populatedBlog._id,
      title: populatedBlog.title,
      content: populatedBlog.content,
      author: populatedBlog.author, // The populated author details
    };
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllBlogFromDB = async (query: Record<string, unknown>) => {
  console.log('main', query);
  const searchableFields = ['title', 'content']; // Fields to search on

  let dbQuery = Blog.find().populate('author', 'name email'); // Base query

  // Build the query using QueryBuilder
  const queryBuilder = new QueryBuilder(dbQuery, query);
  queryBuilder.search(searchableFields).filter().sort().paginate().fields();

  console.log('Final Query:', queryBuilder.modelQuery.getQuery());

  // Execute the query and fetch the results
  const blogs = await queryBuilder.modelQuery;

  return blogs;
};

const updateBlogIntoDB = async (id: string, payload: Partial<IBlog>) => {
  // Check if the blog exists
  const isBlogExist = await Blog.findById(id);
  if (!isBlogExist) {
    throw new Error('Blog not found');
  }

  // Update the blog and populate the 'author' field with name and email only
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('author', 'name email'); // Populate only name and email of the author

  // Transform the result to only return the required fields
  if (!result) {
    throw new Error('Failed to update blog');
  }

  const formattedResult = {
    _id: result._id,
    title: result.title,
    content: result.content,
    author: result.author, // Populated author details
  };

  return formattedResult;
};

const deleteBlogFromDB = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
};

export const BlogServices = {
  createBlogIntoDB,
  getAllBlogFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};
