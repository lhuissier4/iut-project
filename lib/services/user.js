'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@rush33/iut-encrypt');

module.exports = class UserService extends Service {

    create(user){

        const { User } = this.server.models();

        user.password = Encrypt.sha1(user.password);
        return User.query().insertAndFetch(user);
    }
    show() {
        const { User } = this.server.models();
        // Récupère tous les utilisateurs depuis la base de données
        return User.query().select('*');
    }
    delete_user_by_id(id) {
        const { User } = this.server.models();
        // Supprime un utilisateur de la base de données
        return User.query().deleteById(id);
    }
}
