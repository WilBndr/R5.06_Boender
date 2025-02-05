'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'POST',
        path: '/films',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).required(),
                    description: Joi.string().min(10).required(),
                    release_date: Joi.date().required(),
                    director: Joi.string().min(3).required()
                })
            },
            handler: async function(request, h) {
                const { filmService } = request.services();

                return await filmService.create(request.payload);
            }
        }
    }
];
