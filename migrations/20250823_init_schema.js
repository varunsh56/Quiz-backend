export async function up(knex) {
  // users
  await knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("name").notNullable();
    t.string("email").notNullable().unique();
    t.string("password").notNullable();
    t.enum("role", ["user", "admin"]).notNullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // skills
  await knex.schema.createTable("skills", (t) => {
    t.increments("id").primary();
    t.string("name").notNullable().unique();
    t.text("description");
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // questions
  await knex.schema.createTable("questions", (t) => {
    t.increments("id").primary();
    t
      .integer("skill_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("skills")
      .onDelete("CASCADE");
    t.text("question").notNullable();
    t.json("options").notNullable();
    t.integer("correct_index").notNullable();
    t.integer("difficulty").defaultTo(1);
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // quizzes
  await knex.schema.createTable("quizzes", (t) => {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.text("description");
    t
      .integer("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    t.integer("time_limit_minutes").nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // quiz_questions
  await knex.schema.createTable("quiz_questions", (t) => {
    t.increments("id").primary();
    t
      .integer("quiz_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("quizzes")
      .onDelete("CASCADE");
    t
      .integer("question_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("questions")
      .onDelete("CASCADE");
    t.integer("position").defaultTo(0);
    t.unique(["quiz_id", "question_id"]);
  });

  // quiz_attempts
  await knex.schema.createTable("quiz_attempts", (t) => {
    t.increments("id").primary();
    t
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    t
      .integer("quiz_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("quizzes")
      .onDelete("SET NULL");
    t.timestamp("started_at").defaultTo(knex.fn.now());
    t.timestamp("finished_at");
    t.integer("total_score").defaultTo(0);
    t.json("meta");
  });

  // quiz_answers
  await knex.schema.createTable("quiz_answers", (t) => {
    t.increments("id").primary();
    t
      .integer("attempt_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("quiz_attempts")
      .onDelete("CASCADE");
    t
      .integer("question_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("questions")
      .onDelete("CASCADE");
    t.integer("selected_index").nullable();
    t.integer("score").defaultTo(0);
    t.timestamp("answered_at").defaultTo(knex.fn.now());
  });

  // Indexes for performance
  await knex.schema.table("quiz_attempts", (t) => {
    t.index(["user_id", "started_at"]);
  });
  await knex.schema.table("quiz_answers", (t) => {
    t.index(["question_id"]);
  });
}

export async function down(knex) {
  // Drop in reverse order of dependencies
  await knex.schema.dropTableIfExists("quiz_answers");
  await knex.schema.dropTableIfExists("quiz_attempts");
  await knex.schema.dropTableIfExists("quiz_questions");
  await knex.schema.dropTableIfExists("quizzes");
  await knex.schema.dropTableIfExists("questions");
  await knex.schema.dropTableIfExists("skills");
  await knex.schema.dropTableIfExists("users");
}
