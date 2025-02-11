'use strict';

const fs = require('fs');
const path = require('path');

exports.up = async function (knex) {
    const filePath = path.join(__dirname, 'ressources/favorites.json');
    const favorites = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return knex('favorite').insert(favorites);
};

exports.down = async function (knex) {
    return knex('favorite').del(); // 🔥 Supprime tous les favoris ajoutés
};
