'use strict';


const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

/*
    - id: integer
    - user_id: integer
    - film_id: integer
    - created_at: date
    - updated_at: date
    Favs est une table de jointure entre User et Film qui permet de stocker les films favoris d'un utilisateur.
 */
module.exports = class Favs extends Model {

    static get tableName() {
        return 'favs';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            user_id: Joi.number().integer().greater(0),
            film_id: Joi.number().integer().greater(0),
            created_at: Joi.date(),
            updated_at: Joi.date()
        });
    }

    $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    $beforeUpdate() {
        this.updated_at = new Date();
    }

};