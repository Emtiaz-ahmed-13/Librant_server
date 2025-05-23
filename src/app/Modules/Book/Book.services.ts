import QueryBuilder from "../../Builder/QueryBuilder";
import { IBook } from "./Book.interface";
import BookModel from "./Book.model";

const CreateBookInDB = async (payload: IBook) => {
  const result = await BookModel.create(payload);
  return result;
};

const RetriveAllBookFromDB = async (query: Record<string, unknown>) => {
  try {
    const AllBookQuery = new QueryBuilder(BookModel.find(), query)
      .search(["author", "category", "title"])
      .filter()
      .limit();

    // Get count with proper error handling
    const documentCount = await AllBookQuery.countTotal();

    // Add timeout to main query too
    const result = await AllBookQuery.modelQuery.maxTimeMS(30000).exec();

    return {
      meta: {
        count: documentCount,
      },
      data: result,
    };
  } catch (error) {
    console.error("Error retrieving books:", error);
    throw error;
  }
};

const RetriveBookFromDB = async (id: string) => {
  const result = await BookModel.findOne({ _id: id, isDeleted: false });
  return result;
};

const NumberOfCategory = async () => {
  const result = await BookModel.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  return result;
};

const DeleteBookFromDB = async (_id: string) => {
  const result = await BookModel.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  console.log("book Deleted", result);
  return result;
};
const UpdateBookDataInDB = async (_id: string, payload: Partial<IBook>) => {
  const result = await BookModel.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const GetAuthorsFromDB = async () => {
  const result = await BookModel.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
  ]);
  return result;
};

// New services for featured books, new arrivals and categories
const GetFeaturedBooks = async (limit = 10) => {
  try {
    const result = await BookModel.find({
      isFeatured: true,
      isDeleted: false,
      inStock: true,
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .maxTimeMS(30000)
      .exec();

    return result;
  } catch (error) {
    console.error("Error retrieving featured books:", error);
    throw error;
  }
};

const GetNewArrivals = async (limit = 10) => {
  try {
    const result = await BookModel.find({
      isDeleted: false,
      inStock: true,
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .maxTimeMS(30000)
      .exec();

    return result;
  } catch (error) {
    console.error("Error retrieving new arrivals:", error);
    throw error;
  }
};

const GetBooksByCategory = async (category: string, limit = 20) => {
  try {
    const result = await BookModel.find({
      category,
      isDeleted: false,
      inStock: true,
    })
      .limit(limit)
      .maxTimeMS(30000)
      .exec();

    return result;
  } catch (error) {
    console.error(`Error retrieving books for category ${category}:`, error);
    throw error;
  }
};

const GetAllCategories = async () => {
  try {
    // Get all distinct categories from the database
    const categories = await BookModel.distinct("category");
    return categories;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
};

export const BookServices = {
  CreateBookInDB,
  RetriveAllBookFromDB,
  RetriveBookFromDB,
  NumberOfCategory,
  DeleteBookFromDB,
  UpdateBookDataInDB,
  GetAuthorsFromDB,
  // Add new services to exports
  GetFeaturedBooks,
  GetNewArrivals,
  GetBooksByCategory,
  GetAllCategories,
};
