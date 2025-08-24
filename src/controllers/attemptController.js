import knex from "../db/knex.js";

// Start attempt
export const startAttempt = async (req, res, next) => {
  try {
    const { quiz_id } = req.body;
    if (!quiz_id) return res.status(400).json({ message: "Missing quiz_id" });

    const quiz = await knex("quizzes").where({ id: quiz_id }).first();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const [id] = await knex("quiz_attempts").insert({
      user_id: req.user.id,
      quiz_id,
      started_at: knex.fn.now(),
    });

    res.json({ attempt_id: id, quiz_id });
  } catch (err) {
    next(err);
  }
};

// Submit answers
export const submitAttempt = async (req, res, next) => {
  const trx = await knex.transaction();
  try {
    const { attempt_id, answers } = req.body;
    if (!attempt_id || !Array.isArray(answers) || answers.length === 0) {
      await trx.rollback();
      return res.status(400).json({ message: "Missing data" });
    }

    const attempt = await trx("quiz_attempts").where({ id: attempt_id }).first();
    if (!attempt) {
      await trx.rollback();
      return res.status(404).json({ message: "Attempt not found" });
    }
    if (attempt.user_id !== req.user.id && req.user.role !== "admin") {
      await trx.rollback();
      return res.status(403).json({ message: "Not allowed" });
    }

    const quizId = attempt.quiz_id;
    if (!quizId) {
      await trx.rollback();
      return res.status(400).json({ message: "Attempt missing quiz reference" });
    }

    // Validate questions
    const providedQIds = Array.from(new Set(answers.map((a) => a.question_id)));
    const qMappings = await trx("quiz_questions")
      .where({ quiz_id: quizId })
      .whereIn("question_id", providedQIds)
      .select("question_id");

    const allowedIds = new Set(qMappings.map((r) => r.question_id));
    const invalid = providedQIds.filter((id) => !allowedIds.has(id));
    if (invalid.length) {
      await trx.rollback();
      return res.status(400).json({
        message: "Some questions are not part of this quiz",
        invalid,
      });
    }

    // Correct answers
    const questions = await trx("questions")
      .whereIn("id", providedQIds)
      .select("id", "correct_index");

    const qMap = {};
    questions.forEach((q) => (qMap[q.id] = q.correct_index));

    let totalScore = 0;
    const insertRows = answers.map((a) => {
      const correct = qMap[a.question_id];
      const score =
        typeof correct !== "undefined" && correct === a.selected_index ? 1 : 0;
      totalScore += score;
      return {
        attempt_id,
        question_id: a.question_id,
        selected_index: a.selected_index,
        score,
      };
    });

    await trx("quiz_answers").insert(insertRows);
    await trx("quiz_attempts").where({ id: attempt_id }).update({
      finished_at: knex.fn.now(),
      total_score: totalScore,
    });

    await trx.commit();
    res.json({ attempt_id, totalScore });
  } catch (err) {
    await trx.rollback().catch(() => {});
    next(err);
  }
};

// End attempt
export const endAttempt = async (req, res, next) => {
  try {
    const { attempt_id } = req.body;
    if (!attempt_id) return res.status(400).json({ message: "Missing attempt_id" });

    const attempt = await knex("quiz_attempts").where({ id: attempt_id }).first();
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    if (attempt.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await knex("quiz_attempts")
      .where({ id: attempt_id })
      .update({ finished_at: knex.fn.now() });

    res.json({ attempt_id, message: "Attempt ended" });
  } catch (err) {
    next(err);
  }
};
