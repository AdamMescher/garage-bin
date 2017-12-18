exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('reason');
    table.string('cleanliness');
    table.timestamps(true, true);
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('items'),
]);
