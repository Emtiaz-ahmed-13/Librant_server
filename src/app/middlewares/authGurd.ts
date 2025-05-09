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
      throw new CustomError(
        httpStatus.UNAUTHORIZED,
        "No authentication token provided"
      );
    }

    // If token starts with "Bearer ", remove it
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    try {
      const decodedData = jwt.verify(
        token,
        Config.jwt_secret_key as string
      ) as JwtPayload;
      const { email, iat, role } = decodedData;

      if (!email) {
        throw new CustomError(
          httpStatus.UNAUTHORIZED,
          "Invalid token: missing email"
        );
      }

      req.user = decodedData;
      const existUser = await User.findOne({
        email,
      });

      if (!existUser) {
        throw new CustomError(
          httpStatus.NOT_FOUND,
          `User with email ${email} not found`
        );
      }

      if (existUser?.passwordChangeAt && iat) {
        const passwordChangeAt = Math.floor(
          new Date(existUser?.passwordChangeAt).getTime() / 1000
        );

        const checkJwtIssuedBeforeLastPasswordChange = passwordChangeAt > iat;
        if (checkJwtIssuedBeforeLastPasswordChange) {
          throw new CustomError(
            httpStatus.UNAUTHORIZED,
            "Password was changed after token was issued. Please login again."
          );
        }
      }

      if (roles.length && !roles.includes(role)) {
        throw new CustomError(
          httpStatus.FORBIDDEN,
          `Access denied. Required role: ${roles.join(
            " or "
          )}, but user has role: ${role}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError(httpStatus.UNAUTHORIZED, "Invalid token");
      }
      throw error;
    }
  });
};

export default authGurd;
