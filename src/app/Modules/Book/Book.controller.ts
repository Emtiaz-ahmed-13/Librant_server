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

export const BookController = {
  CreateBook,
  RetriveBooks,
  RetriveSingleBook,
  NumberOfCategory,
  DeleteBook,
  UpdateBook,
  GetAuthors,
};
