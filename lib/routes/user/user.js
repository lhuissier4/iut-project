'use strict';


const Joi = require('joi')

module.exports = {
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        auth: false,
        description: 'Create and fetch user',
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().required().min(3).max(30).example('johndoe').description('Username of the user'),
                mail: Joi.string().email().required().example('john.doe@example.com').description('Email of the user'),
                password: Joi.string().min(8).required().example('password123').description('Password of the user (at least 8 characters)'),
                scopes: Joi.array().items(Joi.string().valid('user', 'admin')) // Définition des scopes
                    .default(['user']) // Valeur par défaut
                    .description('Scopes assigned to the user'),
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
};
