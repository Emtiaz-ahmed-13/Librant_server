import { Router } from "express";
import authGurd from "../../middlewares/authGurd";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./User.controller";
import { UserValidation } from "./User.validation";

const router = Router();

router.post(
  "/create-new-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createNewUser
);
router.get("/get-all-users", authGurd("admin"), UserControllers.RetriveUsers);
router.patch(
  "/deactivate-user/:id",
  authGurd("admin"),
  UserControllers.deactivateUser
);
router.patch(
  "/activate-user/:id",
  authGurd("admin"),
  UserControllers.activateUser
);
router.post(
  "/create-admin",
  // Temporarily removed authGurd("admin") to allow first admin creation
  // IMPORTANT: Add this back after creating the first admin
  // authGurd("admin"),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createAdmin
);

export const UserRoutes = router;
