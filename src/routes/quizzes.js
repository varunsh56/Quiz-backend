import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { createQuiz, getQuizDetails } from "../controllers/quizController.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), createQuiz);
router.get("/:id", authMiddleware, getQuizDetails);

export default router;
