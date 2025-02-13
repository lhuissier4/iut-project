'use strict';

const Joi = require('joi');

module.exports = {
    method: 'get',
    path: '/movie/export',
    options: {
        tags: ['api'],
        auth : {
            scope: [ 'admin' ]
        },
        description: 'Export the list of movies to CSV',
        validate: {
            query: Joi.object({
                format: Joi.string().valid('csv').default('csv') // Permet d'ajouter d'autres formats plus tard
            })
        },
    },
    handler: async (request, h) => {
        try {
            const user = request.auth.credentials; // Récupérer l'utilisateur connecté

            const { movieService } = request.services();
            await movieService.export_movie_to_csv(user); // Exécuter l'export et l'envoi d'email
            return h.response({ message: "Votre export est en cours et vous sera envoyé par email." }).code(202);
        } catch (error) {
            console.error("Erreur lors de l'export :", error);
        }
    }
};
