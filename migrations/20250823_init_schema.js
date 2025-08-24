import express from 'express';
import knex from '../db/knex.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /reports/user/:userId
 * User-wise performance: list attempts + average score
 * Optional query params: ?quizId=1
 */
router.get('/user/:userId', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { quizId } = req.query;

    let query = knex('quiz_attempts')
      .where({ user_id: userId })
      .whereNotNull('finished_at'); // only completed attempts

    if (quizId) query = query.andWhere({ quiz_id: quizId });

    const attempts = await query.orderBy('started_at', 'desc');

    const avg = await knex('quiz_attempts')
      .where({ user_id: userId })
      .modify(qb => {
        if (quizId) qb.andWhere({ quiz_id: quizId });
      })
      .whereNotNull('finished_at')
      .avg('total_score as avg_score')
      .first();

    res.json({ attempts, avg: avg?.avg_score || 0 });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /reports/skill-gap
 * Skill gap analysis: average score per skill
 * Optional: ?userId=1&quizId=2&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
router.get('/skill-gap', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const { userId, quizId, from, to } = req.query;

    let q = knex('quiz_answers')
      .join('questions', 'quiz_answers.question_id', 'questions.id')
      .join('quiz_attempts', 'quiz_answers.attempt_id', 'quiz_attempts.id')
      .select('questions.skill_id')
      .avg('quiz_answers.score as avg_score')
      .groupBy('questions.skill_id')
      .whereNotNull('quiz_attempts.finished_at');

    if (userId) q = q.where('quiz_attempts.user_id', userId);
    if (quizId) q = q.where('quiz_attempts.quiz_id', quizId);
    if (from) q = q.where('quiz_attempts.started_at', '>=', from);
    if (to) q = q.where('quiz_attempts.finished_at', '<=', to);

    const rows = await q;

    // Fetch skill names
    const skillIds = rows.map(r => r.skill_id);
    const skills = await knex('skills')
      .whereIn('id', skillIds)
      .select('id', 'name');

    const skillMap = {};
    skills.forEach(s => { skillMap[s.id] = s.name; });

    const result = rows.map(r => ({
      skill_id: r.skill_id,
      skill: skillMap[r.skill_id] || null,
      avg_score: parseFloat(r.avg_score)
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /reports/time-series
 * Attempts over time with avg score
 * Optional: ?range=7d&quizId=1
 */
router.get('/time-series', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const { range = '7d', quizId } = req.query;
    const days = range.endsWith('d') ? parseInt(range.slice(0, -1)) : 7;

    let q = knex('quiz_attempts')
      .where('started_at', '>=', knex.raw(`DATE_SUB(NOW(), INTERVAL ? DAY)`, [days]))
      .whereNotNull('finished_at');

    if (quizId) q = q.andWhere({ quiz_id: quizId });

    const rows = await q
      .select(knex.raw(`DATE(started_at) as date`))
      .avg('total_score as avg_score')
      .count('* as attempts')
      .groupByRaw('DATE(started_at)')
      .orderBy('date', 'asc');

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
