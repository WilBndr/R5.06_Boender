'use strict';


const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

/*
    - id: integer
    - title: string
    - description: string
    - release_date: date
    - director: string
    - created_at: date
    - updated_at: date
    Film est une table qui permet de stocker les films de la base de données
 */
module.exports = class Film extends Model {

    static get tableName() {
        return 'films';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).max(255).required(),
            description: Joi.string().min(10).required(),
            release_date: Joi.date().required(),
            director: Joi.string().min(3).max(255).required(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};
