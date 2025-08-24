import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import skillRoutes from './routes/skills.js';
import questionRoutes from './routes/questions.js';
import attemptRoutes from './routes/attempts.js';
import reportRoutes from './routes/reports.js';
import errorHandler from './middleware/errorHandler.js';
import quizRoutes from './routes/quizzes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/reports', reportRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ ok: true }));

// Error Handler
app.use(errorHandler);

export default app;