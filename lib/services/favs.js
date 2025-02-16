'use strict';

const { Service } = require('@hapipal/schmervice');


module.exports = class FavsService extends Service {

    /*
    * Cree un lien favori entre un utilisateur et un film
    * @param {Object}
    * @return {Promise}
     */
    async create(favs){
        const { Favs } = this.server.models();
        return Favs.query().insertAndFetch(favs);
    }

    /*
    * Supprime un lien favori entre un utilisateur et un film
    * @param {Number}
    * @return {Promise}
     */
    async delete(id){
        const { Favs } = this.server.models();
        return Favs.query().deleteById(id)
    }

    /*
    * Permet de verifier si un lien favori existe entre un utilisateur et un film
    * @param {Number} user_id
    * @param {Number} film_id
     */
    async findByUserAndFilm(user_id, film_id) {
        const { Favs } = this.server.models();
        return Favs.query().findOne({ user_id, film_id });
    }

    /*
    * Permet de recuperer l'enssemble des ID des utilisateurs ayant l'ID du film renseigne en favori
    * @param {Number} film_id
    * @return {Promise}
     */
    async findAllUsersIdByfilmId(film_id){
        const { Favs } = this.server.models();

        const rows = await Favs.query().where('film_id', film_id);

        const favs = rows.map(row => row.user_id);

        return favs;
    }

}