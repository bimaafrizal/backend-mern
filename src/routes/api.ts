import express from "express";
import dumyController from '../controllers/dummy.controller.ts';
import authController from "../controllers/auth.controller.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

router.get('/dumy', dumyController.dumy);
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
