const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const { createObjectCsvStringifier } = require('csv-writer');

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
    async export_movie_to_csv(user) {
        let csv_file = await this.create_csv_file_of_movie();
        const { mailService } = this.server.services();
        if (!user || !user.email) {
            console.error("❌ Erreur : L'email de l'utilisateur est manquant !");
            throw new Error("L'email de l'utilisateur est invalide.");
        }
        try{
            await mailService.sendMail(
                user.email,
                'Export des films en CSV',
                `Bonjour ${user.firstName} ${user.lastName}, Voici le fichier CSV contenant la liste des films.`,
                `<p>Bonjour ${user.firstName} ${user.lastName}, Voici le fichier CSV contenant la liste des films.</p>`,
                "export.csv",
                csv_file

            );
        }catch (err) {
            console.error("Error sending the email:", err);
            throw Boom.internal("Unable to send the email");
        }


    }
    async create_csv_file_of_movie() {

        let {Movie} = this.server.models();

        try {
            // Récupération des films en BDD
            const movies = await Movie.query().select(
                'id', 'title', 'originalTitle', 'description',
                'releaseDate', 'director', 'posterPath', 'createdAt', 'updatedAt'
            );

            if (movies.length === 0) {
                throw new Error("Aucun film trouvé dans la base de données.");
            }

            // Création du CSV Stringifier
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    {id: 'id', title: 'ID'},
                    {id: 'title', title: 'Title'},
                    {id: 'originalTitle', title: 'Original Title'},
                    {id: 'description', title: 'Description'},
                    {id: 'releaseDate', title: 'Release Date'},
                    {id: 'director', title: 'Director'},
                    {id: 'posterPath', title: 'Poster Path'},
                    {id: 'createdAt', title: 'Created At'},
                    {id: 'updatedAt', title: 'Updated At'}
                ]
            });

            // Générer le contenu CSV en mémoire
            let csvContent = csvStringifier.getHeaderString();
            csvContent += csvStringifier.stringifyRecords(movies);

            console.log(`CSV généré en RAM (taille : ${Buffer.byteLength(csvContent, 'utf8')} octets)`);

            return csvContent; // Retourne le CSV sous forme de chaîne

        } catch (error) {
            console.error("Erreur lors de la génération du CSV :", error);
            throw new Error("Impossible d'exporter les films.");
        }
    }
}