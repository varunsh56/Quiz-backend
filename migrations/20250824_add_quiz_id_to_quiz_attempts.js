export async function up(knex) {
  await knex.schema.table("quiz_attempts", (t) => {
    t.integer("quiz_id").unsigned().nullable()
      .references("id").inTable("quizzes")
      .onDelete("SET NULL");
  });
}

export async function down(knex) {
  await knex.schema.table("quiz_attempts", (t) => {
    t.dropColumn("quiz_id");
  });
}