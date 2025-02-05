'use strict';

exports.up = async function(knex) {
    await knex.schema.alterTable('user', (table) => {
        table.string('username').notNullable().unique().after('lastName');
        table.string('mail').notNullable().unique().after('username');
        table.string('password').notNullable().after('mail');
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('username');
        table.dropColumn('mail');
        table.dropColumn('password');
    });
};
