import { Router } from "express";
import { authController } from "./auth.controller";
import logger from "../../middleware/logger";

const router = Router();

router.post("/signin", logger, authController.loginUser);

router.post("/signup", logger, authController.registerUser);

export const authRoutes = router;

