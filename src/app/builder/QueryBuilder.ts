import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search as string;
    if (search) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }, // Case-insensitive regex
      }));

      this.modelQuery = this.modelQuery.find({ $or: searchConditions });
      console.log('Search conditions:', searchConditions);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      'search',
      'sortBy',
      'sortOrder',
      'page',
      'limit',
      'fields',
    ];

    excludeFields.forEach((field) => delete queryObj[field]);

    if (queryObj.filter) {
      queryObj.author = queryObj.filter;
      delete queryObj.filter;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortBy = this?.query?.sortBy as string;
    const sortOrder = this?.query?.sortOrder as string;

    if (sortBy) {
      const sortStr = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
      this.modelQuery = this.modelQuery.sort(sortStr);
    }
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    // Default to specific fields if no fields parameter is provided
    const fields = this.query.fields
      ? (this.query.fields as string).split(',').join(' ')
      : '_id title content author'; // Default fields

    this.modelQuery = this.modelQuery.select(fields);
    console.log('Fields applied:', fields);
    return this;
  }
}

export default QueryBuilder;
