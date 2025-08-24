import knex from '../db/knex.js';

// Get list of questions with optional filters
export const listQuestions = async (req, res, next) => {
  try {
    const { skill_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let q = knex('questions').select('*');
    if (skill_id) q = q.where({ skill_id });

    const items = await q.limit(limit).offset(offset);

    res.json(
      items.map(r => ({
        ...r,
        options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options
      }))
    );
  } catch (err) {
    next(err);
  }
};

// Admin: Add a question
export const addQuestion = async (req, res, next) => {
  try {
    const { skill_id, question, options, correct_index, difficulty } = req.body;

    if (!skill_id || !question || !options || correct_index === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [id] = await knex('questions').insert({
      skill_id,
      question,
      options: JSON.stringify(options),
      correct_index,
      difficulty
    });

    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};
