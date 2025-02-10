'use strict';

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('movies', (table) => {
            table.increments('id').primary();
            table.string('title', 255).notNullable();
            table.string('originalTitle', 255).notNullable();
            table.text('description').notNullable();
            table.date('releaseDate').notNullable();
            table.string('director').notNullable();
            table.string('posterPath').notNullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
        });
    },
    down: async (knex) => {
        await knex.schema.dropTableIfExists('movies');
    }
};