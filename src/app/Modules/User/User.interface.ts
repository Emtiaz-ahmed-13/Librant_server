import { Types } from "mongoose";

export interface IUser {
  id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  passwordChangeAt?: Date;
  phone?: string;
  address?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
  activity: "activated" | "deactivated";
}
