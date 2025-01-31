'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const Encrypt = require('@rush33/iut-encrypt');

module.exports = {
    method: 'POST',
    path: '/user/login',
    options: {
        tags: ['api'],
        description: 'Authenticate user by email or username and password',
        validate: {
            payload: Joi.object({
                login: Joi.string().required().example('johndoe1@example.com').description('Username or email of the user'),
                password: Joi.string().required().example('password123').description('Password of the user')
            })
        }
    },
    handler: async (request, h) => {
        const { login, password } = request.payload;
        const { userService } = request.services();

        // Authenticate the user
        const isAuthenticated = await userService.authenticate(login, password);

        if (!isAuthenticated) {
            throw Boom.unauthorized('Invalid username, email, or password');
        }

        return h.response({ login: "successful" }).code(200);
    }
};
