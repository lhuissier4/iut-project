'use strict';

const Joi = require('joi');

module.exports = {
    method: 'get',
    path: '/users',
    options: {
        auth : {
            scope: [ 'user' ]
        },
        tags: ['api'], // For Swagger documentation
        description: 'Get all users',
        notes: 'Returns a list of all users',
        response: {
            schema: Joi.array().items(
                Joi.object({
                    id: Joi.number().integer().example(1).description('ID of the user'),
                    firstName: Joi.string().example('John').description('First name of the user'),
                    lastName: Joi.string().example('Doe').description('Last name of the user'),
                    createdAt: Joi.date().description('Creation timestamp'),
                    updatedAt: Joi.date().description('Last update timestamp'),
                    username: Joi.string().example('johndoe').description('Username of the user'),
                    password: Joi.string().example('password123').description('Password of the user'),
                    mail: Joi.string().example('john.doe@example.com').description('email of the user'),
                    scopes: Joi.array().items(Joi.string().valid('user', 'admin')) // Définition des scopes
                        .default(['user']) // Valeur par défaut
                        .description('Scopes assigned to the user'),
                })
            )
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();

        // Fetch all users from the database
        const users = await userService.show();

        // Return the list of users
        return users;
    }
};
