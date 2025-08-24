import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  getUserPerformance,
  getSkillGapReport,
  getTimeSeriesReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/user/:userId", authMiddleware, requireRole("admin"), getUserPerformance);
router.get("/skill-gap", authMiddleware, requireRole("admin"), getSkillGapReport);
router.get("/time-series", authMiddleware, requireRole("admin"), getTimeSeriesReport);

export default router;
