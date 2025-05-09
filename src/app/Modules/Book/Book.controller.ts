import httpStatus from "http-status";
import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { BookServices } from "./Book.services";

const CreateBook = catchAsync(async (req, res) => {
  const result = await BookServices.CreateBookInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});
const RetriveBooks = catchAsync(async (req, res) => {
  const queries = req.query;
  console.log(queries);
  const result = await BookServices.RetriveAllBookFromDB(queries);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});
const RetriveSingleBook = catchAsync(async (req, res) => {
  const result = await BookServices.RetriveBookFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});

const NumberOfCategory = catchAsync(async (req, res) => {
  const result = await BookServices.NumberOfCategory();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});
const DeleteBook = catchAsync(async (req, res) => {
  const result = await BookServices.DeleteBookFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book Deleted successfully",
    data: result,
  });
});
const UpdateBook = catchAsync(async (req, res) => {
  const result = await BookServices.UpdateBookDataInDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book Updated successfully",
    data: result,
  });
});

const GetAuthors = catchAsync(async (req, res) => {
  const result = await BookServices.GetAuthorsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});

// New controller methods for featured books, new arrivals, and categories
const GetFeaturedBooks = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await BookServices.GetFeaturedBooks(limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Featured books retrieved successfully",
    data: result,
  });
});

const GetNewArrivals = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await BookServices.GetNewArrivals(limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New arrivals retrieved successfully",
    data: result,
  });
});

const GetBooksByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await BookServices.GetBooksByCategory(category, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Books for category ${category} retrieved successfully`,
    data: result,
  });
});

const GetAllCategories = catchAsync(async (req, res) => {
  const result = await BookServices.GetAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All categories retrieved successfully",
    data: result,
  });
});

export const BookController = {
  CreateBook,
  RetriveBooks,
  RetriveSingleBook,
  NumberOfCategory,
  DeleteBook,
  UpdateBook,
  GetAuthors,
  // Add new controller methods
  GetFeaturedBooks,
  GetNewArrivals,
  GetBooksByCategory,
  GetAllCategories,
};
