import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //   search(searchableFields: string[]) {
  //     const search = this?.query?.search;
  //     if (search) {
  //       this.modelQuery = this.modelQuery.find({
  //         $or: searchableFields.map(
  //           (field) =>
  //             ({
  //               [field]: { $regex: search, $options: 'i' },
  //             }) as FilterQuery<T>,
  //         ),
  //       });
  //     }

  //     return this;
  //   }

  search(searchableFields: string[]) {
    const search = this?.query?.search;
    if (search) {
      console.log('Search term:', search); // Debugging search term
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' }, // Ensure regex is correctly applied
        })),
      });
    }
    return this;
  }

  //   filter() {
  //     const queryObj = { ...this.query };

  //     const excludeFields = [
  //       'searchTerm',
  //       'sort',
  //       'page',
  //       'limit',
  //       'sortBy',
  //       'sortOrder',
  //       'fields',
  //     ];

  //     excludeFields.forEach((el) => delete queryObj[el]);

  //     this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

  //     return this;
  //   }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = [
      'searchTerm',
      'sort',
      'page',
      'limit',
      'sortBy',
      'sortOrder',
      'fields',
    ];

    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.filter) {
      console.log('Applying filter:', queryObj.filter); // Log the filter being applied
      queryObj.author = queryObj.filter; // Apply filter by authorId
      delete queryObj.filter; // Remove filter field from query
    }

    console.log('Query after filter applied:', queryObj);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    let sortStr;

    const sortBy = this?.query?.sortBy;
    const sortOrder = this?.query?.sortOrder;

    sortStr = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;

    this.modelQuery = this.modelQuery.sort(sortStr);
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
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
