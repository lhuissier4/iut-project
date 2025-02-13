const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {
    async modify_movie(movie) {
        let { Movie, User, Favorite } = this.server.models();
        const { mailService } = this.server.services();

        return Movie.query().findById(movie.id).then(async (existingMovie) => {
            if (!existingMovie) {
                throw new Error(`Movie with ID ${movie.id} not found`);
            }

            // Merge existing user data with the provided payload
            let updatedMovie = {...existingMovie, ...movie};



            try {
                let users = await User.query().select('id', 'firstName', 'lastName', 'username', 'mail');
                try {
                    let favorites = await Favorite.query().select('user_id', 'movie_id').where('movie_id', movie.id);
                    for (let favorite of favorites) {
                        for (let user of users) {
                            if (favorite.user_id === user.id) {
                                await mailService.sendMail(
                                    user.mail,
                                    'Modification d\'un film favori',
                                    `Un film favori à été modifié. Bonjour ${user.firstName} ${user.lastName}, le film ${movie.title} a été modifié !`,
                                    `<h1>Un film favori à été modifié.</h1><p>Bonjour ${user.firstName} ${user.lastName}, le film ${movie.title} a été modifié</p>`
                                );
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching the favorites:", err);
                    throw Boom.internal("Unable to fetch users");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                throw Boom.internal("Unable to fetch users");
            }

            return Movie.query().patchAndFetchById(movie.id, updatedMovie);
        });
    }
    async create_movie(movie,user) {
        const { Movie, User } = this.server.models();
        const { mailService } = this.server.services();
        let users = [];
        try {
            users = await User.query().select('id', 'firstName', 'lastName', 'username', 'mail');

        } catch (err) {
            console.error("Error fetching users:", err);
            throw Boom.internal("Unable to fetch users");
        }
        // ------faire une boucle pour chaque user-------
        for (let user of users) {
            await mailService.sendMail(
                user.mail,
                'Ajout d\'un film',
                `Un Nouveau film est disponible. Bonjour ${user.firstName} ${user.lastName}, le film ${movie.title} est désormais accessible sur la plateforme !`,
                `<h1>Un Nouveau film est disponible</h1><p>Bonjour ${user.firstName} ${user.lastName}, le film ${movie.title} est désormais accéssible sur la plateforme!</p>`
            );
        }
        // ----------------------------------------------
        return Movie.query().insertAndFetch(movie);
    }
    delete_movie_by_id(id) {
        let { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }
}