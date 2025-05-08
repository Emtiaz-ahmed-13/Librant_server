import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import Config from "../Config";
import CustomError from "../Errors/CustomError";
import { User } from "../Modules/User/User.model";
import catchAsync from "../Utils/catchAsync";

const authGurd = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    // Get token from authorization header or cookies
    let token = req.headers?.authorization;

    // If no token in header, check cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    // If token starts with "Bearer ", remove it
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decodedData = jwt.verify(
      token,
      Config.jwt_secret_key as string
    ) as JwtPayload;
    const { email, iat, role } = decodedData;
    req.user = decodedData;
    const existUser = await User.findOne({
      email,
    });
    if (!existUser) {
      throw new CustomError(httpStatus.NOT_FOUND, "User not found");
    }
    if (existUser?.passwordChangeAt && iat) {
      const passwordChangeAt = Math.floor(
        new Date(existUser?.passwordChangeAt).getTime() / 1000
      );

      const checkJwtIssuedBeforeLastPasswordChange = passwordChangeAt > iat;
      if (checkJwtIssuedBeforeLastPasswordChange) {
        throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
    }
    // console.log('roles', roles, 'role', role);
    if (roles.length && !roles.includes(role)) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    next();
  });
};

export default authGurd;
