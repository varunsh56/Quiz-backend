import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getSkills, createSkill } from '../controllers/skillController.js';

const router = express.Router();

router.get('/', authMiddleware, getSkills);
router.post('/', authMiddleware, requireRole('admin'), createSkill);

export default router;