import { Router } from "express";
import { loginController } from "../Controllers/authController.js";

const authRoutes = Router();   

authRoutes.post('/login', loginController);

export { authRoutes };