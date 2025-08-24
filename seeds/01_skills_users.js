import bcrypt from 'bcrypt';

export async function seed(knex) {
  // 🔹 Truncate all tables in correct dependency order
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0;'); // Disable FK checks for truncation
  await knex('quiz_answers').truncate();
  await knex('quiz_attempts').truncate();
  await knex('quiz_questions').truncate();
  await knex('quizzes').truncate();
  await knex('questions').truncate();
  await knex('skills').truncate();
  await knex('users').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1;'); // Re-enable FK checks

  // 🔹 Insert skills
  await knex('skills').insert([
    { id: 1, name: 'JavaScript', description: 'JS fundamentals' },
    { id: 2, name: 'Databases', description: 'SQL basics' },
  ]);

  // 🔹 Hash passwords
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);

  // 🔹 Insert users
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

  // 🔹 Insert questions
  await knex('questions').insert([
    {
      skill_id: 1,
      question: 'What is closure in JS?',
      options: JSON.stringify(['A', 'B', 'C', 'D']), // Ensure JSON format
      correct_index: 0,
      difficulty: 2,
    },
  ]);
}
