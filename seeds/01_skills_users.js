import bcrypt from 'bcrypt';

export async function seed(knex) {
  // Delete existing data
  await knex('quiz_answers').del().catch(() => {});
  await knex('quiz_attempts').del().catch(() => {});
  await knex('questions').del().catch(() => {});
  await knex('skills').del().catch(() => {});
  await knex('users').del().catch(() => {});

  // Insert skills
  await knex('skills').insert([
    { id: 1, name: 'JavaScript', description: 'JS fundamentals' },
    { id: 2, name: 'Databases', description: 'SQL basics' },
  ]);

  // Hash passwords
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);

  // Insert users
  await knex('users').insert([
    {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPass,
      role: 'admin',
    },
    {
      id: 2,
      name: 'User One',
      email: 'user@example.com',
      password: userPass,
      role: 'user',
    },
  ]);

  // Insert questions
  await knex('questions').insert([
    {
      skill_id: 1,
      question: 'What is closure in JS?',
      options: ['A', 'B', 'C', 'D'],
      correct_index: 0,
      difficulty: 2,
    },
  ]);
}