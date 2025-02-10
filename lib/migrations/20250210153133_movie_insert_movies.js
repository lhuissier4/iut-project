const fs = require("fs");
const path = require("path");

exports.up = async function (knex) {
    const filePath = path.join(__dirname, "ressources/movies.json");
    const movies = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Formater les données pour correspondre à la structure de la table
    const formattedMovies = movies.map(movie => ({
        title: movie.title,
        originalTitle: movie.originalTitle,
        description: movie.description,
        releaseDate: movie.releaseDate, // Assurez-vous que c'est une date valide (YYYY-MM-DD)
        director: Array.isArray(movie.director) ? movie.director.join(", ") : movie.director, // Convertir en chaîne
        posterPath: movie.posterPath
    }));

    // Insérer les données dans la table
    return knex("movies").insert(formattedMovies);
};

exports.down = async function (knex) {
    const filePath = path.join(__dirname, "ressources/movies.json");
    const movies = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return knex("movies")
        .whereIn(
            "title",
            movies.map(movie => movie.title)
        )
        .del();
};
