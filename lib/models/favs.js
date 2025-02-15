'use strict';


const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

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