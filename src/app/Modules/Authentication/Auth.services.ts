import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import Config from "../../Config";
import CustomError from "../../Errors/CustomError";
import { User } from "../User/User.model";

const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // Check if email and password are provided
  if (!email || !password) {
    throw new CustomError(
      httpStatus.BAD_REQUEST,
      "Email and password are required"
    );
  }

  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new CustomError(
      httpStatus.NOT_FOUND,
      `User not found with email ${email}`
    );
  }
  // console.log('from line 20', userExist.password);

  // Make sure password is defined before comparison
  if (!userExist.password) {
    throw new CustomError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User password is not set properly"
    );
  }

  const isPasswordMatched = bcrypt.compareSync(password, userExist.password);
  if (!isPasswordMatched) {
    throw new CustomError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  return userExist;
};

const updatePasswordInDB = async (payload: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const { email, oldPassword, newPassword } = payload;
  console.log("from line 38", email, oldPassword, newPassword);

  // Validate all required fields
  if (!email || !oldPassword || !newPassword) {
    throw new CustomError(
      httpStatus.BAD_REQUEST,
      "Email, old password, and new password are required"
    );
  }

  // Checking user exists in db or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(httpStatus.NOT_FOUND, "User not found");
  }

  // Ensure password is defined
  if (!user.password) {
    throw new CustomError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User password is not set properly"
    );
  }

  // Checking old password is correct or not
  const isPasswordMatched = bcrypt.compareSync(oldPassword, user.password);
  console.log("from line 43", isPasswordMatched);
  if (!isPasswordMatched) {
    throw new CustomError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  const hashedNewPassword = bcrypt.hashSync(
    newPassword,
    Number(Config.bcrypt_salt_rounds)
  );
  user.password = hashedNewPassword;
  const result = await user.save();
  return result;
};

export const AuthServices = { Login, updatePasswordInDB };
