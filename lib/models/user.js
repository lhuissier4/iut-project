'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');


module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),

            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),

            username: Joi.string().min(3).max(30).required()
                .example('johndoe')
                .description('Username of the user'),

            mail: Joi.string().email().required()
                .example('john.doe@example.com')
                .description('Email of the user'),

            password: Joi.string().min(8).required()
                .example('password123')
                .description('Password of the user (at least 8 characters)'),

            createdAt: Joi.date(),
            updatedAt: Joi.date(),

            scopes: Joi.array().items(Joi.string().valid('user', 'admin')) // Définition des scopes
                .default(['user']) // Valeur par défaut
                .description('Scopes assigned to the user'),
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};
