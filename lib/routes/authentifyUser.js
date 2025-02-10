'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const Encrypt = require('@rush33/iut-encrypt');
const Jwt = require('@hapi/jwt'); // Importer le module JWT

module.exports = {
    method: 'POST',
    path: '/user/login',
    options: {
        tags: ['api'],
        auth: false,
        description: 'Authenticate user by email or username and password, and return a JWT',
        validate: {
            payload: Joi.object({
                login: Joi
                    .string()
                    .required()
                    .example('alice.dupont@example.com')
                    .description('Username or email of the user'),
                password: Joi
                    .string()
                    .required()
                    .example('password123')
                    .description('Password of the user')
            })
        }
    },
    handler: async (request, h) => {
        const { login, password } = request.payload;
        const { userService } = request.services();

        // Authenticate the user
        const user = await userService.authenticate(login, password);

        if (!user) {
            throw Boom.unauthorized('Invalid username, email, or password');
        }
        if (!user.scope) {
            throw Boom.unauthorized('missing scope');
        }
        // Generate JWT
        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.mail,
                scope: user.scope,
            },
            {
                key: 'random_string', // La clé qui doit être définie dans votre configuration JWT
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 heures
            }
        );

        return h.response({ login: "successful", token }).code(200);
    }
};
