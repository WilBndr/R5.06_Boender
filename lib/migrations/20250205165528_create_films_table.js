exports.up = function(knex) {
    return knex.schema.createTable('films', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.date('release_date').notNullable();
        table.string('director').notNullable();

        table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('films');
};
