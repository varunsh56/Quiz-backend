import knex from "../db/knex.js";

// Create a new quiz
export const createQuiz = async (req, res, next) => {
  const trx = await knex.transaction();
  try {
    const { title, description, time_limit_minutes = null, questions = [] } = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      await trx.rollback();
      return res.status(400).json({ message: "Missing title or questions" });
    }

    // Validate question IDs
    const qIds = questions.map((q) => q.question_id);
    const existing = await trx("questions").whereIn("id", qIds).select("id");
    const existingIds = new Set(existing.map((r) => r.id));
    const missing = qIds.filter((id) => !existingIds.has(id));
    if (missing.length) {
      await trx.rollback();
      return res
        .status(400)
        .json({ message: "Some question IDs not found", missing });
    }

    // Insert quiz
    const [quizId] = await trx("quizzes").insert({
      title,
      description,
      created_by: req.user.id,
      time_limit_minutes,
    });

    // Insert quiz_questions
    const rows = questions.map((q, idx) => ({
      quiz_id: quizId,
      question_id: q.question_id,
      position: typeof q.position === "number" ? q.position : idx,
    }));
    await trx("quiz_questions").insert(rows);

    await trx.commit();
    res.status(201).json({ id: quizId, title });
  } catch (err) {
    await trx.rollback().catch(() => {});
    next(err);
  }
};

// Get quiz details
export const getQuizDetails = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.id, 10);
    const quiz = await knex("quizzes").where({ id: quizId }).first();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Get questions
    const mappings = await knex("quiz_questions")
      .where({ quiz_id: quizId })
      .orderBy("position", "asc")
      .select("question_id", "position");

    const ids = mappings.map((m) => m.question_id);
    const questions = await knex("questions").whereIn("id", ids).select("*");

    // Preserve order
    const qMap = {};
    questions.forEach((q) => {
      q.options =
        typeof q.options === "string" ? JSON.parse(q.options) : q.options;
      qMap[q.id] = q;
    });
    const orderedQuestions = ids.map((id) => qMap[id]);

    res.json({ ...quiz, questions: orderedQuestions });
  } catch (err) {
    next(err);
  }
};
