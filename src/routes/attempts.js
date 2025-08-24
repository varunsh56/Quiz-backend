import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  startAttempt,
  submitAttempt,
  endAttempt,
} from "../controllers/attemptController.js";

const router = express.Router();

router.post("/start", authMiddleware, startAttempt);
router.post("/submit", authMiddleware, submitAttempt);
router.post("/end", authMiddleware, endAttempt);

export default router;
