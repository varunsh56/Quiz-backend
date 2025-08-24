import knex from "../db/knex.js";

// Get user performance (average and attempts)
export const getUserPerformance = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const attempts = await knex("quiz_attempts")
      .where({ user_id: userId })
      .orderBy("started_at", "desc");

    const avg = await knex("quiz_attempts")
      .where({ user_id: userId })
      .avg("total_score as avg_score")
      .first();

    res.json({ attempts, avg: avg.avg_score || 0 });
  } catch (err) {
    next(err);
  }
};

// Skill gap identification
export const getSkillGapReport = async (req, res, next) => {
  try {
    const { userId, from, to } = req.query;

    let query = knex("quiz_answers")
      .join("questions", "quiz_answers.question_id", "questions.id")
      .join("quiz_attempts", "quiz_answers.attempt_id", "quiz_attempts.id")
      .select("questions.skill_id")
      .avg("quiz_answers.score as avg_score")
      .groupBy("questions.skill_id");

    if (userId) query = query.where("quiz_attempts.user_id", userId);
    if (from) query = query.where("quiz_attempts.started_at", ">=", from);
    if (to) query = query.where("quiz_attempts.finished_at", "<=", to);

    const rows = await query;

    // Fetch skill names
    const skillIds = rows.map((r) => r.skill_id);
    const skills = await knex("skills").whereIn("id", skillIds).select("id", "name");

    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.id] = s.name;
    });

    const result = rows.map((r) => ({
      skill_id: r.skill_id,
      skill: skillMap[r.skill_id] || null,
      avg_score: parseFloat(r.avg_score),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Time-based performance report
export const getTimeSeriesReport = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const days = range.endsWith("d") ? parseInt(range.slice(0, -1)) : 7;

    const rows = await knex("quiz_attempts")
      .where(
        "started_at",
        ">=",
        knex.raw(`DATE_SUB(NOW(), INTERVAL ? DAY)`, [days])
      )
      .select(knex.raw(`DATE(started_at) as date`))
      .avg("total_score as avg_score")
      .count("* as attempts")
      .groupByRaw("DATE(started_at)")
      .orderBy("date", "asc");

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
