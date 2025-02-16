'use strict';

const Joi = require('joi');


// Fonction de vérification si l'utilisateur est admin
const isNotAdmin = (user) => {
    return !user.scope || (Array.isArray(user.scope) && !user.scope.includes("admin")) || (typeof user.scope === "string" && user.scope !== "admin");
};

module.exports = [
    {
        method: 'delete',
        path: '/films/{id}',
        options: {
            tags: ['api'],
            auth: 'jwt', // Oblige l'authentification JWT
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();

            const user = request.auth.credentials;

            if (isNotAdmin(user)) {
                return h.response({ message: 'Unauthorized' }).code(401);
            }else {
                return await filmService.create(request.payload);
            }
        }
    },
    {
        method: 'POST',
        path: '/films',
        options: {
            auth: 'jwt',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).required(),
                    description: Joi.string().min(10).required(),
                    release_date: Joi.date().required(),
                    director: Joi.string().min(3).required()
                })
            },
            handler: async function (request, h) {
                const {filmService, mailService, userService} = request.services();

                const user = request.auth.credentials;

                if (isNotAdmin(user)) {
                    return h.response({ message: 'Unauthorized' }).code(401);
                } else {
                    try {
                        const usersEmail = await userService.getAllEmails();
                        await mailService.broadcastEmail('Nouveau film ajouté', 'Un nouveau film a été ajouté à la base de données',usersEmail);
                    } catch (error) {
                        console.error('Error sending email', error);
                    }
                    return await filmService.create(request.payload);
                }
            }
        }
    },
    {
        method: 'patch',
        path: '/films/{id}',
        options: {
            tags:['api'],
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().min(3),
                    description: Joi.string().min(10),
                    release_date: Joi.date(),
                    director: Joi.string().min(3)
                })
            }
        },
        handler(request, h) {

            const { filmService } = request.services();

            const user = request.auth.credentials;

            if (isNotAdmin(user)) {
                return h.response({ message: 'Unauthorized' }).code(401);
            } else {
                return filmService.update(request.params.id, request.payload);
            }
        }
    }
];
