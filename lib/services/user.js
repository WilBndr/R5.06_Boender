'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    /*
    * Cree un utilisateur
    * @param {Object} user
    * @return {Promise}
     */
    create(user){

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    /*
    * Recupere l'ensemble des utilisateurs
    * @return {Promise}
     */
    findAll(){

        const { User } = this.server.models();

        return User.query();
    }

    /*
    * Recupere l'ensemble des emails des utilisateurs
    * @return {Promise}
     */
    async getAllEmails() {
        const { User } = this.server.models();
        const users = await User.query().select('email');
        return users.map(user => user.email);
    }

    /*
    * Supprime un utilisateur selon l'id
    * @param {Number} id
    * @return {Promise}
     */
    delete(id){

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    /*
    * Met à jour un utilisateur
    * @param {Number} id
    * @param {Object} user
     */
    update(id, user){

        const { User } = this.server.models();

        //mettre à jour le champ updatedAt
        user.updatedAt = new Date();

        return User.query().findById(id).patch(user);
    }

    /*
    * Permet de verifier si un utilisateur existe selon son email et son mot de passe
    * @param {String} email
    * @param {String} password
    * @return {Promise}
     */
    async login(email, password) {

        const { User } = this.server.models();

        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }

    /*
    * Recupere un utilisateur selon son email
    * @param {String} email
    * @return {Promise}
     */
    async findByEmail(email) {
        const { User } = this.server.models();
        return User.query().findOne({ email });
    }

    /*
    * Recupere un utilisateur selon son id
    * @param {Number} id
     */
    async findByID(id) {
        const { User } = this.server.models();
        return User.query().findById(id);
    }

}
