'use strict';

const Joi = require('joi');

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
            },
            pre: [
                {
                    method: async (request, h) => {
                        const user = request.auth.credentials; // Récupère les données du token

                        // Vérifie si scope est une chaîne ou un tableau et s'il contient "admin"
                        if (!user.scope || (Array.isArray(user.scope) && !user.scope.includes("admin")) || (typeof user.scope === "string" && user.scope !== "admin")) {
                            return h.response({ message: 'Unauthorized' }).code(401);
                        }

                        return h.continue;
                    }
                }
            ]
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.delete(request.params.id);
        }

    },


];
