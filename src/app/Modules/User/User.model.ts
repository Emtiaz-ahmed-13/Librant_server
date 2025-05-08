import { Schema, model } from "mongoose";
import { IUser } from "./User.interface";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordChangeAt: { type: Number, default: Date.now() },
    activity: {
      type: String,
      enum: ["activated", "deactivated"],
      default: "activated",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model<IUser>("User", UserSchema);
