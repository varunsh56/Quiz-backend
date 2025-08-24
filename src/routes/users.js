import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole('admin'), getUsers);
router.post('/', authMiddleware, requireRole('admin'), createUser);

export default router;
