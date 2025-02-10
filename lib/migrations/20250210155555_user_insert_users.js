/*const fs = require("fs");
const path = require("path");
const Encrypt = require("@rush33/iut-encrypt");

exports.up = async function (knex) {
    const filePath = path.join(__dirname, "ressources/users.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Formater les données pour correspondre à la structure de la table
    const formattedUsers = users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        mail: user.mail,
        password: Encrypt.sha1(user.password),
        scopes: Array.isArray(user.scopes) ? JSON.stringify(user.scopes) : user.scopes, // Stocker en JSON
    }));

    // Insérer les données dans la table
    return knex("user").insert(formattedUsers);
};

exports.down = async function (knex) {
    const filePath = path.join(__dirname, "ressources/users.json");
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return knex("user")
        .whereIn(
            "username",
            users.map(user => user.username)
        )
        .del();
};
*/
exports.up = function () {};
exports.down = function () {};