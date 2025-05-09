import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import Config from "../../Config";
import CustomError from "../../Errors/CustomError";
import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { AuthServices } from "./Auth.services";

const LoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.Login(req.body);
  const payload = { id: result?._id, role: result?.role, email: result?.email };
  const accessToken = jwt.sign(payload, Config.jwt_secret_key as string, {
    expiresIn: Config.jwt_expires_in,
  });

  // Set token as a cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1209600,
  });

  // Also set Authorization header
  res.setHeader("Authorization", `Bearer ${accessToken}`);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      userInfo: {
        role: result?.role,
        email: result?.email,
        name: result?.name,
      },
    },
  });
});

const updatePassword = catchAsync(async (req, res) => {
  // Check if all required fields are present in the request body
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    throw new CustomError(httpStatus.BAD_REQUEST, "Old password is required");
  }

  if (!newPassword) {
    throw new CustomError(httpStatus.BAD_REQUEST, "New password is required");
  }

  // Use the email from the JWT token (the authenticated user)
  // This is more secure than allowing the user to change any email's password
  if (!req.user?.email) {
    throw new CustomError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Create the payload with the email from the token
  const payload = {
    email: req.user.email,
    oldPassword,
    newPassword,
  };

  const result = await AuthServices.updatePasswordInDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

export const AuthControllers = { LoginUser, updatePassword };
