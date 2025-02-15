'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'POST',
        path : '/favs/add/{film_id}',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                params: Joi.object({
                    film_id: Joi.number().integer().required().min(1) // Film ID vient des params
                }),
                payload: Joi.object({
                    user_id: Joi.number().integer().required().min(1) // User ID vient du body
                })
            }
        },
        handler: async (request, h) => {
            const { favsService } = request.services();
            const { film_id } = request.params;
            const { user_id } = request.payload;

            return await favsService.create({ user_id, film_id });
        }
    }
];
