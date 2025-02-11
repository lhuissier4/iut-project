'use strict';

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('favorite', (table) => {
            table.integer('user_id').unsigned().notNullable();
            table.integer('movie_id').unsigned().notNullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());

            // Définir la clé primaire composée (user_id + movie_id)
            table.primary(['user_id', 'movie_id']);

            // Ajouter les clés étrangères (foreign keys)
            table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
            table.foreign('movie_id').references('id').inTable('movie').onDelete('CASCADE');

        });
    },

    down: async (knex) => {
        await knex.schema.dropTableIfExists('favorite');
    }
};
