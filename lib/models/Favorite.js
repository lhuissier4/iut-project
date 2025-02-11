const {Model} = require("@hapipal/schwifty");
const Joi = require("joi");
module.exports = class Favorite extends Model {

    static get tableName() {
        return 'favorite';
    }

    static get idColumn() {
        return ['user_id', 'movie_id'];
    }

    static get joiSchema() {
        return Joi.object({
            user_id: Joi.number().integer().greater(0).required()
                .description('ID of the user who favorited the movie'),

            movie_id: Joi.number().integer().greater(0).required()
                .description('ID of the favorited movie'),
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
    static get relationMappings() {
        const User = require('./User');
        const Movie = require('./Movie');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorite.user_id',
                    to: 'user.id'
                }
            },
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: {
                    from: 'favorite.movie_id',
                    to: 'movie.id'
                }
            }
        };
    }

}