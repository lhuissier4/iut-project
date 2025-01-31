'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        description: 'Modify and fetch user',
        validate: {
            params: Joi.object({
                id: Joi.alternatives().try(
                    Joi.string().uuid(),
                    Joi.number().integer().positive()
                ).required().description('User ID (UUID or integer)')
            }),
            payload: Joi.object({
                firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().min(3).max(30).example('johndoe').description('Username of the user'),
                mail: Joi.string().email().example('john.doe@example.com').description('Email of the user'),
                password: Joi.string().min(8).example('password123').description('Password of the user (at least 8 characters)')
            }).min(1) // Allow at least one field in the payload
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();

        // Merge payload with the existing user
        return await userService.modify_user({ id: request.params.id, ...request.payload });
    }
};
