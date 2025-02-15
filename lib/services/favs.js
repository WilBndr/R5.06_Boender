'use strict';

const { Service } = require('@hapipal/schmervice');


module.exports = class FavsService extends Service {

    async create(favs){
        const { Favs } = this.server.models();
        return Favs.query().insertAndFetch(favs);
    }

    deleteFav(film_id, user_id) {
        const { Favs } = this.server.models();
        return Favs.query().delete().where({ film_id, user_id });
    }
}