'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@rush33/iut-encrypt');

function addNumberToEmail(email, number) {
    if (!email) {
        throw new Error('Email is required');
    }
    if (!number) {
        throw new Error('Number is required');
    }

    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
        throw new Error('Invalid email format');
    }

    // Insert the number before the '@'
    return `${email.slice(0, atIndex)}${number}${email.slice(atIndex)}`;
}

module.exports = class UserService extends Service {
    // Method to get the next ID
    async getNextId() {
        const knex = this.server.knex(); // Get the Knex instance

        // Query the maximum ID in the table
        const result = await knex('user').max('id as maxId').first();

        const maxId = result.maxId || 0; // Default to 0 if the table is empty
        return maxId + 1;
    }


    async create(user) {
        const { User } = this.server.models();

        // Get the next ID
        const id = await this.getNextId();
        //console.log('Next ID:', id);

        // Avoid duplicates
        user.id= id;
        user.username = user.username + id;
        user.mail = addNumberToEmail(user.mail, id);

        // Hash the password
        user.password = Encrypt.sha1(user.password);

        // Insert the user into the database
        return User.query().insertAndFetch(user);
    }

    show() {
        const { User } = this.server.models();
        // Retrieve all users from the database
        return User.query().select('*');
    }

    delete_user_by_id(id) {
        const { User } = this.server.models();
        // Delete a user from the database
        return User.query().deleteById(id);
    }

    modify_user(user) {
        const { User } = this.server.models();

        // Fetch existing user data
        return User.query().findById(user.id).then((existingUser) => {
            if (!existingUser) {
                throw new Error(`User with ID ${user.id} not found`);
            }

            // Merge existing user data with the provided payload
            const updatedUser = { ...existingUser, ...user };

            // Update and fetch the user
            return User.query().patchAndFetchById(user.id, updatedUser);
        });

    }
    async authenticate(login, password) {
        const {User} = this.server.models();

        // Find user by email or username
        const user = await User.query()
            .where('mail', login)
            .orWhere('username', login)
            .first();

        // If user does not exist, return false
        if (!user) {
            return false;
        }
        const hashedPassword = Encrypt.sha1(password);
        if (user.password !== hashedPassword) {
            return false;
        }

        // If everything matches, return true
        return true;
    }
};
