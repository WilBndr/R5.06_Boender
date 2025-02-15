exports.up = function(knex) {
    return knex.schema.createTable('favs', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('film_id').unsigned().notNullable();

        // Définir les clés étrangères
        table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE'); // Si l'utilisateur est supprimé, supprimer aussi les favoris
        table.foreign('film_id').references('id').inTable('films').onDelete('CASCADE'); // Si le film est supprimé, supprimer aussi les favoris

        // Ajouter les timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // Assurer que la combinaison de user_id et film_id soit unique
        table.unique(['user_id', 'film_id']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('favs');
};
