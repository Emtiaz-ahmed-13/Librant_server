import { Router } from "express";
import authGurd from "../../middlewares/authGurd";
import { AuthControllers } from "./Auth.controller";

const router = Router();

router.post("/login", AuthControllers.LoginUser);
router.put("/update-password", authGurd(), AuthControllers.updatePassword);

export const AuthRoutes = router;
