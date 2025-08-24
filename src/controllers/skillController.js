import knex from '../db/knex.js';

export const getSkills = async (req, res, next) => {
  try {
    const skills = await knex('skills').select('*').orderBy('name');
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    // Check if skill already exists (case-insensitive)
    const existingSkill = await knex('skills')
      .whereRaw('LOWER(name) = ?', [name.toLowerCase()])
      .first();

    if (existingSkill) {
      return res.status(409).json({ error: 'Skill with this name already exists' });
    }

    // Insert new skill
    const [id] = await knex('skills').insert({ name, description });
    res.status(201).json({ id, name, description });

  } catch (err) {
    next(err);
  }
};
