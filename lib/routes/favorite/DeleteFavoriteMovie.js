'use strict';

const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/favorite', // Endpoint sans paramètres dans l'URL
    options: {
        auth: {
            scope: ['user']
        },
        tags: ['api'], // Pour Swagger documentation
        description: 'Delete favorite movies by movie ID and user ID',
        notes: 'Returns 204 No Content if successful',
        validate: {
            payload: Joi.object({
                movie_id: Joi.alternatives().try(
                    Joi.number().integer().positive()
                ).required().description('Favorite movie ID (UUID or integer)').example(1),
                user_id: Joi.alternatives().try(
                    Joi.number().integer().positive()
                ).required().description('User ID (UUID or integer)').example(1)
            }) // Déplacer les IDs dans le payload
        }
    },
    handler: async (request, h) => {
        const { favoriteService } = request.services();
        const { movie_id, user_id } = request.payload; // Récupérer les valeurs du body

        return await favoriteService.delete_favorite_movie_by_id(movie_id, user_id);

    }
};
