'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');


module.exports = class Movie extends Model {

    static get tableName() {
        return 'movie';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().example("Sherlock Holmes").description('Title of the movie'),
            originalTitle: Joi.string().example("Sherlock Holmes").description('Original title of the movie'),
            description: Joi.string().example("Detective Sherlock Holmes and his stalwart partner Watson engage in a battle of wits and brawn with a nemesis whose plot is a threat to all of England.").description('Description of the movie'),
            releaseDate: Joi.date().example("2009-12-25").description('Date of release of the movie'),
            director: Joi.string().example("Guy Ritchie").description('Director of the movie'),
            posterPath: Joi.string().example("https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTcwMzk0MjQ5Mg@@._V1_.jpg").description('Poster path of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        });
    }

    $beforeInsert() {
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
};