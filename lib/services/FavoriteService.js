
'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteService extends Service {

    async add_favorite_movie({ user_id, movie_id }) {
        const { User, Movie, Favorite } = this.server.models(); // ✅ Récupérer les modèles

        // Vérifier si l'utilisateur et le film existent
        const userExists = await User.query().findById(user_id);
        const movieExists = await Movie.query().findById(movie_id);

        if (!userExists) {
            throw Boom.notFound(`User with id ${user_id} not found`);
        }
        if (!movieExists) {
            throw Boom.notFound(`Movie with id ${movie_id} not found`);
        }

        try {
            // Insérer un favori
            return await Favorite.query().insertAndFetch({ user_id, movie_id });
        } catch (err) {
            console.error("Error inserting favorite movie:", err);
            throw Boom.internal("Database error while adding favorite movie");
        }
    }


}