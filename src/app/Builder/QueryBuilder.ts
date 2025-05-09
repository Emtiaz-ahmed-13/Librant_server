import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }
    return this;
  }
  filter() {
    const queryObject = { ...this.query };
    const excludedFields = ["searchTerm", "page", "limit", "sort"];
    excludedFields.forEach((field) => delete queryObject[field]);
    if (queryObject.minPrice && queryObject.maxPrice) {
      queryObject.price = {
        $gte: Number(queryObject.minPrice),
        $lte: Number(queryObject.maxPrice),
      };
      delete queryObject.minPrice;
      delete queryObject.maxPrice;
    }
    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);
    return this;
  }
  limit() {
    this.modelQuery = this.modelQuery.limit(Number(this?.query?.limit));
    return this;
  }

  async countTotal() {
    try {
      const totalQueries = this.modelQuery.getFilter();
      // Add maxTimeMS to prevent timeout on large collections
      const totalDocuments = await this.modelQuery.model
        .countDocuments(totalQueries)
        .maxTimeMS(30000) // 30 second timeout
        .exec();
      return totalDocuments;
    } catch (error) {
      console.error("Error counting documents:", error);
      // Return 0 if count operation times out
      return 0;
    }
  }
}

export default QueryBuilder;
