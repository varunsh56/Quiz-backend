import knex from '../db/knex.js';
import bcrypt from 'bcrypt';

// Get users with pagination/filter
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const offset = (page - 1) * limit;

    let query = knex('users')
      .select('id', 'name', 'email', 'role', 'created_at')
      .orderBy('id', 'desc');

    if (q) {
      query = query
        .where('name', 'like', `%${q}%`)
        .orWhere('email', 'like', `%${q}%`);
    }

    const items = await query.limit(limit).offset(offset);
    const [{ count }] = await knex('users').count('* as count');

    res.json({
      data: items,
      total: parseInt(count, 10),
      page: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

// Create user (admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const exists = await knex('users').where({ email }).first();
    if (exists) {
      return res.status(409).json({ message: 'User exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [id] = await knex('users').insert({
      name,
      email,
      password: hash,
      role,
    });

    res.json({ id, name, email, role });
  } catch (err) {
    next(err);
  }
};
