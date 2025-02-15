'use strict';

const Joi = require('joi');
const {Boom} = require("@hapi/boom");

module.exports = [
    {
        method: 'POST',
        path : '/favs/add/{film_id}',
        options: {
            tags: ['api'],
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    film_id: Joi.number().integer().required().min(1) // Film ID vient des params
                })
            }
        },
        handler: async (request, h) => {
            const { favsService, userService } = request.services(); // userService pour récupérer l'utilisateur
            const { film_id } = request.params;

            // Récupérer l'utilisateur authentifié
            const user = request.auth.credentials;

            if (!user || !user.email) {
                return h.response({ message: 'Unauthorized' }).code(401);
            }

            try {
                // Récupérer l'ID de l'utilisateur depuis la base de données
                const userRecord = await userService.findByEmail(user.email);

                if (!userRecord) {
                    return h.response({ message: 'Utilisateur introuvable' }).code(404);
                }

                const user_id = userRecord.id;

                const findFav = await favsService.findByUserAndFilm(user_id,film_id);

                if (findFav) {
                    return h.response({ message: 'Favoris déjà ajouté' }).code(400);
                }

                const favData = { user_id, film_id };

                const fav = await favsService.create(favData);
                return h.response(fav).code(201);
            } catch (error) {
                return h.response({ message: 'Erreur interne' }).code(500);
            }
        }

    }
];
