import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getSkills, createSkill } from '../controllers/skillController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management endpoints
 */

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     description: Returns a list of all skills in the system.
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: JavaScript
 *                   description:
 *                     type: string
 *                     example: A high-level programming language
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, getSkills);

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     description: Add a new skill to the system (Admin only).
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Node.js
 *               description:
 *                 type: string
 *                 example: JavaScript runtime built on Chrome's V8 engine
 *     responses:
 *       201:
 *         description: Skill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 name:
 *                   type: string
 *                   example: Node.js
 *                 description:
 *                   type: string
 *                   example: JavaScript runtime built on Chrome's V8 engine
 *       400:
 *         description: Bad request (missing skill name)
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Skill already exists
 */
router.post('/', authMiddleware, requireRole('admin'), createSkill);

export default router;
