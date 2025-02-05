'use strict';

const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/user/{id}',
    options: {
        auth : {
            scope: [ 'admin' ]
        },
        tags: ['api'], // For Swagger documentation
        description: 'Delete user by ID',
        notes: 'Returns 204 No Content if successful',
        validate: {
            params: Joi.object({
                id: Joi.alternatives().try(
                    Joi.string().uuid(),
                    Joi.number().integer().positive()
                ).required().description('User ID (UUID or integer)')
            })
        },
        response: {
            emptyStatusCode: 204 // Indique que la réponse doit être vide
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        await userService.delete_user_by_id(request.params.id);

        return h.response().code(204); // Retourne un 204 No Content
    }
};
