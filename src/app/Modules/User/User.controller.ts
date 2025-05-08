import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import Config from "../../Config";

import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { User } from "./User.model";
import { UserServices } from "./User.services";

const createNewUser = catchAsync(async (req, res) => {
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    Number(Config.bcrypt_salt_rounds)
  );
  const userDataWithCncryptedPassword = {
    ...req.body,
    password: hashedPassword,
  };
  const result = await UserServices.RegisterUserIntoDb(
    userDataWithCncryptedPassword
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const RetriveUsers = catchAsync(async (req, res) => {
  const result = await UserServices.RetriveAllUserFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const deactivateUser = catchAsync(async (req, res) => {
  const result = await UserServices.deactivateUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deactivated successfully",
    data: result,
  });
});
const activateUser = catchAsync(async (req, res) => {
  const result = await UserServices.activateUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User activated successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(
      req.body.password,
      Number(Config.bcrypt_salt_rounds)
    );
    const adminDataWithEncryptedPassword = {
      ...req.body,
      password: hashedPassword,
    };

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "User with this email already exists",
        data: null,
      });
    }

    const result = await UserServices.createAdmin(
      adminDataWithEncryptedPassword
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to create admin",
      data: error,
    });
  }
});

export const UserControllers = {
  createNewUser,
  RetriveUsers,
  deactivateUser,
  activateUser,
  createAdmin,
};
