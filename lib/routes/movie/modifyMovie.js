'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/movie/{id}',
    options: {
        tags: ['api'],
        auth : {
            scope: [ 'admin' ]
        },
        description: 'Modify and fetch movie',
        validate: {
            params: Joi.object({
                id: Joi.alternatives().try(
                    Joi.string().uuid(),
                    Joi.number().integer().positive()
                ).required().description('Movie ID (UUID or integer)')
            }),
            payload: Joi.object({
                title: Joi.string().example("Sherlock Holmes").description('Title of the movie'),
                originalTitle: Joi.string().example("Sherlock Holmes").description('Original title of the movie'),
                description: Joi.string().example("Detective Sherlock Holmes and his stalwart partner Watson engage in a battle of wits and brawn with a nemesis whose plot is a threat to all of England.").description('Description of the movie'),
                releaseDate: Joi.date().example("2009-12-25").description('Date of release of the movie'),
                director: Joi.string().example("Guy Ritchie").description('Director of the movie'),
                posterPath: Joi.string().example("https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTcwMzk0MjQ5Mg@@._V1_.jpg").description('Poster path of the movie'),

            }).min(1) // Allow at least one field in the payload
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();

        // Merge payload with the existing Movie
        return await movieService.modify_movie({ id: request.params.id, ...request.payload });
    }
};
