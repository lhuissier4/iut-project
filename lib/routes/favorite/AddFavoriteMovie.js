'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/favorite',
    options: {
        tags: ['api'],
        auth : {
            scope: [ 'user' ]
        },
        description: 'Add and fetch a movie in the favorite list',
        validate: {
            payload: Joi.object({
                user_id: Joi.number().integer().greater(0).required()
                    .description('ID of the user who favorited the movie')
                    .example(1),

                movie_id: Joi.number().integer().greater(0).required()
                    .description('ID of the favorited movie')
                    .example(1),

            }).min(1) // Allow at least one field in the payload
        }
    },
    handler: async (request, h) => {
        const { favoriteService } = request.services();


        return await favoriteService.add_favorite_movie({ ...request.payload });
    }
};
