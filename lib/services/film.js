'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class FilmService extends Service {

    create(film){
        const { Film } = this.server.models();
        return Film.query().insertAndFetch(film);
    }

    delete(id){
        const { Film } = this.server.models();
        return Film.query().deleteById(id);
    }

    update(id, film){
        const { Film } = this.server.models();

        //mettre à jour le champ updatedAt
        film.updatedAt = new Date();

        return Film.query().findById(id).patch(film);
    }

}