import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  getUserPerformance,
  getSkillGapReport,
  getTimeSeriesReport,
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Analytics and reporting endpoints
 */

/**
 * @swagger
 * /reports/user/{userId}:
 *   get:
 *     summary: Get user performance report
 *     description: Returns all quiz attempts and average score for a given user.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User performance report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attempts:
 *                   type: array
 *                   description: List of quiz attempts
 *                   items:
 *                     type: object
 *                 avg:
 *                   type: number
 *                   description: Average score of all attempts
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: User or attempts not found
 */
router.get("/user/:userId", authMiddleware, requireRole("admin"), getUserPerformance);

/**
 * @swagger
 * /reports/skill-gap:
 *   get:
 *     summary: Get skill gap analysis
 *     description: Returns average scores per skill for a user or across all users, optionally filtered by date range.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: ID of the user to filter results
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date to filter attempts (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date to filter attempts (ISO 8601)
 *     responses:
 *       200:
 *         description: Skill gap report with average scores per skill
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   skill_id:
 *                     type: integer
 *                   skill:
 *                     type: string
 *                   avg_score:
 *                     type: number
 *       403:
 *         description: Forbidden (admin only)
 */
router.get("/skill-gap", authMiddleware, requireRole("admin"), getSkillGapReport);

/**
 * @swagger
 * /reports/time-series:
 *   get:
 *     summary: Get time-series performance report
 *     description: Returns average quiz scores and attempt counts grouped by date over a given time range.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           example: "7d"
 *         description: Number of days to look back (default 7d)
 *     responses:
 *       200:
 *         description: Time-series report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   avg_score:
 *                     type: number
 *                   attempts:
 *                     type: integer
 *       403:
 *         description: Forbidden (admin only)
 */
router.get("/time-series", authMiddleware, requireRole("admin"), getTimeSeriesReport);

export default router;
