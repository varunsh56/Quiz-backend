import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { createQuiz, getQuizDetails } from "../controllers/quizController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Manage quizzes and their questions
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the quiz
 *               description:
 *                 type: string
 *                 description: Optional description of the quiz
 *               time_limit_minutes:
 *                 type: integer
 *                 nullable: true
 *                 description: Optional time limit for the quiz (in minutes)
 *               questions:
 *                 type: array
 *                 description: List of questions to include in the quiz
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       description: ID of the question
 *                     position:
 *                       type: integer
 *                       description: Order of the question in the quiz
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *       400:
 *         description: Missing title or questions, or invalid question IDs
 *       403:
 *         description: Forbidden (admin only)
 */
router.post("/", authMiddleware, requireRole("admin"), createQuiz);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get quiz details with its questions
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 time_limit_minutes:
 *                   type: integer
 *                 created_by:
 *                   type: integer
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       question:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correct_index:
 *                         type: integer
 *                       skill_id:
 *                         type: integer
 *                       difficulty:
 *                         type: string
 *       404:
 *         description: Quiz not found
 */
router.get("/:id", authMiddleware, getQuizDetails);

export default router;
