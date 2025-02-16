'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

/*
    - id: integer
    - firstName: string
    - lastName: string
    - email: string
    - password: string
    - username: string
    - roles: array
    - created_at: date
    - updated_at: date
    User est une table qui permet de stocker les utilisateurs de l'application
 */
module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            email: Joi.string().email(),
            password: Joi.string(),
            username: Joi.string(),
            roles: Joi.array().items(Joi.string()).default(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

    static get jsonAttributes(){

        return ['roles']
    }


};
