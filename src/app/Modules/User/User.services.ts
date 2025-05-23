import { TRegister } from "../../types/global";
import { User } from "./User.model";

const RegisterUserIntoDb = async ({ name, email, password }: TRegister) => {
  const result = await User.create({
    email,
    password,
    name,
  });
  return result;
};

const RetriveAllUserFromDB = async () => {
  const result = await User.find({});
  return result;
};

const activateUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(id, { activity: "activated" });
  return result;
};

const deactivateUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(id, { activity: "deactivated" });
  return result;
};

const createAdmin = async ({ name, email, password }: TRegister) => {
  const result = await User.create({
    email,
    password,
    name,
    role: "admin",
  });
  return result;
};

export const UserServices = {
  RegisterUserIntoDb,
  RetriveAllUserFromDB,
  activateUser,
  deactivateUser,
  createAdmin,
};
