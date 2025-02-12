
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
            // Insérer un film favori
            return await Favorite.query().insertAndFetch({ user_id, movie_id });
        } catch (err) {
            console.error("Error inserting favorite movie:", err);
            throw Boom.internal("Database error while adding favorite movie");
        }
    }
    delete_favorite_movie_by_id(movie_id, user_id) {
        const { Favorite } = this.server.models(); // ✅ Récupérer le modèle

        return Favorite.query()
            .where('movie_id', movie_id)
            .andWhere('user_id', user_id)
            .delete()
            .then((rowsDeleted) => {
                if (rowsDeleted === 0) {
                    return {
                        status: 404,
                        error: "No favorite movie found with this ID and user ID"
                    };
                }
                return {
                    status: 200,
                    message: "Favorite movie deleted successfully"
                };
            })
            .catch((error) => {
                return {
                    status: 500,
                    error: "An error occurred while deleting the favorite movie",
                    details: error.message
                };
            });
    }
}