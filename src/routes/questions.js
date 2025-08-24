import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { listQuestions, addQuestion } from '../controllers/questionController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API endpoints for managing questions
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get a list of questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skill_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter questions by skill ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   skill_id:
 *                     type: integer
 *                   question:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                   correct_index:
 *                     type: integer
 *                   difficulty:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, listQuestions);

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Add a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skill_id
 *               - question
 *               - options
 *               - correct_index
 *             properties:
 *               skill_id:
 *                 type: integer
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correct_index:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware, requireRole('admin'), addQuestion);

export default router;
