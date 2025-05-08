import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import Config from "../../Config";
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
  const result = await AuthServices.updatePasswordInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

export const AuthControllers = { LoginUser, updatePassword };
