'use strict';

exports.up = async function(knex) {
    await knex.schema.table('user', function(table) {
        table.json('scopes').notNullable(); // Ajout de la colonne JSON sans valeur par défaut
    });

    // Mise à jour de toutes les lignes pour définir une valeur par défaut
    await knex('user').update({
        scopes: JSON.stringify(['user']) // Valeur par défaut définie manuellement
    });
};

exports.down = function(knex) {
    return knex.schema.table('user', function(table) {
        table.dropColumn('scopes'); // Suppression de la colonne lors du rollback
    });
};
