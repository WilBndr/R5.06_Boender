'use strict';

const { Service } = require('@hapipal/schmervice');


module.exports = class FilmService extends Service {

    /*
    * Cree un film
    * param {Object} film
    * return {Promise}
     */
    create(film){
        const { Film } = this.server.models();
        return Film.query().insertAndFetch(film);
    }

    /*
    * Supprime un film selon l'id
    * @param {Number} id
    * @return {Promise}
     */
    delete(id){
        const { Film } = this.server.models();
        return Film.query().deleteById(id);
    }

    /*
    * Met à jour un film
    * @param {Number} id
    * @param {Object} film
    * @return {Promise}
     */
    update(id, film){
        const { Film } = this.server.models();

        //mettre à jour le champ updatedAt
        film.updatedAt = new Date();

        return Film.query().findById(id).patch(film);
    }

    /*
    * Recupere un film selon l'id
    * @param {Number} id
    * @return {Promise}
     */
    findById(id){
        const { Film } = this.server.models();
        return Film.query().findById(id);
    }

}