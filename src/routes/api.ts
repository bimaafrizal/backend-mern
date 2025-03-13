import express from "express";
import dumyController from '../controllers/dummy.controller';
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/dumy', dumyController.dumy);

//auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me",authMiddleware, authController.me);
export default router;
