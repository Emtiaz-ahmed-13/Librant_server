import { Schema, model } from "mongoose";
import { IUser } from "./User.interface";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
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
