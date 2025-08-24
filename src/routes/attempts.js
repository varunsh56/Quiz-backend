import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  startAttempt,
  submitAttempt,
  endAttempt,
} from "../controllers/attemptController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attempts
 *   description: Manage quiz attempts
 */

/**
 * @swagger
 * /attempts/start:
 *   post:
 *     summary: Start a new quiz attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiz_id
 *             properties:
 *               quiz_id:
 *                 type: integer
 *                 description: ID of the quiz to attempt
 *     responses:
 *       200:
 *         description: Attempt started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attempt_id:
 *                   type: integer
 *                 quiz_id:
 *                   type: integer
 *       400:
 *         description: Missing quiz_id
 *       404:
 *         description: Quiz not found
 */
router.post("/start", authMiddleware, startAttempt);

/**
 * @swagger
 * /attempts/submit:
 *   post:
 *     summary: Submit answers for a quiz attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attempt_id
 *               - answers
 *             properties:
 *               attempt_id:
 *                 type: integer
 *                 description: ID of the attempt
 *               answers:
 *                 type: array
 *                 description: Array of answers for the attempt
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - selected_index
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                     selected_index:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attempt_id:
 *                   type: integer
 *                 totalScore:
 *                   type: integer
 *       400:
 *         description: Missing data or invalid question IDs
 *       403:
 *         description: Forbidden (not your attempt)
 *       404:
 *         description: Attempt not found
 */
router.post("/submit", authMiddleware, submitAttempt);

/**
 * @swagger
 * /attempts/end:
 *   post:
 *     summary: End a quiz attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attempt_id
 *             properties:
 *               attempt_id:
 *                 type: integer
 *                 description: ID of the attempt to end
 *     responses:
 *       200:
 *         description: Attempt ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attempt_id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing attempt_id
 *       403:
 *         description: Forbidden (not your attempt)
 *       404:
 *         description: Attempt not found
 */
router.post("/end", authMiddleware, endAttempt);

export default router;
