'use strict';

const { Service } = require('@hapipal/schmervice');


module.exports = class FavsService extends Service {

    async create(favs){
        const { Favs } = this.server.models();
        return Favs.query().insertAndFetch(favs);
    }

    async delete(id){
        const { Favs } = this.server.models();
        return Favs.query().deleteById(id)
    }

    async findByUserAndFilm(user_id, film_id) {
        const { Favs } = this.server.models();
        return Favs.query().findOne({ user_id, film_id });
    }

    async findAllByfilmId(film_id){
        const { Favs } = this.server.models();

        const rows = await Favs.query().where('film_id', film_id);

        const favs = rows.map(row => row.user_id);

        return favs;
    }

}