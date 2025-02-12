const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {
    modify_movie(movie) {
        let { Movie } = this.server.models();

        return Movie.query().findById(movie.id).then((existingMovie) => {
            if (!existingMovie) {
                throw new Error(`Movie with ID ${movie.id} not found`);
            }

            // Merge existing user data with the provided payload
            let updatedMovie = { ...existingMovie, ...movie };

            // Update and fetch the user
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