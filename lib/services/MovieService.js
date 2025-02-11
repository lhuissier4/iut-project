const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {
    modify_movie(movie) {
        const { Movie } = this.server.models();

        return Movie.query().findById(movie.id).then((existingMovie) => {
            if (!existingMovie) {
                throw new Error(`Movie with ID ${movie.id} not found`);
            }

            // Merge existing user data with the provided payload
            const updatedMovie = { ...existingMovie, ...movie };

            // Update and fetch the user
            return Movie.query().patchAndFetchById(movie.id, updatedMovie);
        });
    }
    create_movie(movie) {
        const { Movie } = this.server.models();
        return Movie.query().insertAndFetch(movie);
    }
    delete_movie_by_id(id) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }
}