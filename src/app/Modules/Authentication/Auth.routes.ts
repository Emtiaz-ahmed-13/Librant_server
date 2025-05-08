import { Router } from "express";
import { AuthControllers } from "./Auth.controller";

const router = Router();

router.post("/login", AuthControllers.LoginUser);
router.put("/update-password", AuthControllers.updatePassword);

export const AuthRoutes = router;
