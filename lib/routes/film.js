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
                        await mailService.broadcastEmail(usersEmail, 'Nouveau film ajouté', 'Un nouveau film a été ajouté à la base de données');
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
        handler: async (request, h) => {
            const { filmService, userService, mailService, favsService } = request.services();
            const user = request.auth.credentials;

            if (isNotAdmin(user)) {
                return h.response({ message: 'Unauthorized' }).code(401);
            } else {
                const favs = await favsService.findAllUsersIdByfilmId(request.params.id);

                // Envoi d'un email à tous les utilisateurs ayant ajouté le film à leurs favoris
                for (const favUserID of favs) {
                    const user = await userService.findByID(favUserID);
                    await mailService.sendEmail(user.email, 'Film modifié', 'Le film que vous avez ajouté à vos favoris a été modifié');
                }

                return await filmService.update(request.params.id, request.payload);
            }
        }
    },
    {
        method: 'GET',
        path: '/export',
        options: {
            auth: 'jwt',
            tags: ['api'],
        },
        handler: async (request, h) => {
            const { exportService,filmService } = request.services();
            const user = request.auth.credentials;

            if (isNotAdmin(user)) {
                return h.response({ message: 'Unauthorized' }).code(401);
            }

            try {
                const films = await filmService.all();
                console.log(films);
                const response = await exportService.export(user, films);
                return h.response(response).code(202); // 202 = Accepted
            } catch (error) {
                console.error("❌ Erreur dans /export :", error);
                return h.response({ message: "Erreur interne" }).code(500);
            }
        }
    }


];
