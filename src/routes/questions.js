import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { listQuestions, addQuestion } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', authMiddleware, listQuestions);
router.post('/', authMiddleware, requireRole('admin'), addQuestion);

export default router;
