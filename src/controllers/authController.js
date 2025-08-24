import knex from '../db/knex.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await knex('users').where({ email }).first();
    if (exists) {
      return res.status(409).json({ message: 'User exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [id] = await knex('users').insert({ name, email, password: hash, role });

    res.json({ id, name, email, role });
  } catch (err) {
    next(err);
  }
}


export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
}