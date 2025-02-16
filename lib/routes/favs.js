'use strict';

const Joi = require('joi');

// Messages d'erreur constants pour une gestion centralisée
const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized',
    USER_NOT_FOUND: 'Utilisateur introuvable',
    FAV_ALREADY_ADDED: 'Favoris déjà ajouté',
    FILM_NOT_FOUND: 'Film introuvable',
    FAV_NOT_FOUND: 'Favoris inexistant',
    INTERNAL_ERROR: 'Erreur interne'
};

module.exports = [
    {
        method: 'POST',
        path: '/favs/add/{film_id}',
        options: {
            tags: ['api'],
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    film_id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { favsService, userService, filmService } = request.services();
            const { film_id } = request.params;
            const user = request.auth.credentials;

            // Vérification de l'authentification de l'utilisateur
            if (!user || !user.email) {
                return h.response({ message: ERROR_MESSAGES.UNAUTHORIZED }).code(401);
            }

            try {
                // Recherche de l'utilisateur par email
                const userRecord = await userService.findByEmail(user.email);

                if (!userRecord) {
                    return h.response({ message: ERROR_MESSAGES.USER_NOT_FOUND }).code(404);
                }

                const user_id = userRecord.id;
                // Vérification si le favori existe déjà pour cet utilisateur et ce film
                const existingFav = await favsService.findByUserAndFilm(user_id, film_id);
                // Recherche du film par ID
                const filmRecord = await filmService.findById(film_id);

                if (existingFav) {
                    return h.response({ message: ERROR_MESSAGES.FAV_ALREADY_ADDED }).code(400);
                }

                if (!filmRecord) {
                    return h.response({ message: ERROR_MESSAGES.FILM_NOT_FOUND }).code(404);
                }

                // Création du favori
                const favData = { user_id, film_id };
                const fav = await favsService.create(favData);
                return h.response(fav).code(201);
            } catch (error) {
                // Gestion des erreurs internes
                return h.response({ message: ERROR_MESSAGES.INTERNAL_ERROR }).code(500);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/favs/del/{film_id}',
        options: {
            tags: ['api'],
            auth: 'jwt',
            validate: {
                params: Joi.object({
                    film_id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            const { favsService, userService } = request.services();
            const { film_id } = request.params;
            const user = request.auth.credentials;

            // Vérification de l'authentification de l'utilisateur
            if (!user || !user.email) {
                return h.response({ message: ERROR_MESSAGES.UNAUTHORIZED }).code(401);
            }

            try {
                // Recherche de l'utilisateur par email
                const userRecord = await userService.findByEmail(user.email);

                if (!userRecord) {
                    return h.response({ message: ERROR_MESSAGES.USER_NOT_FOUND }).code(404);
                }

                const user_id = userRecord.id;
                // Vérification si le favori existe pour cet utilisateur et ce film
                const existingFav = await favsService.findByUserAndFilm(user_id, film_id);

                if (!existingFav) {
                    return h.response({ message: ERROR_MESSAGES.FAV_NOT_FOUND }).code(400);
                }

                // Suppression du favori
                await favsService.delete(existingFav.id);
                return h.response().code(204);
            } catch (error) {
                // Gestion des erreurs internes
                return h.response({ message: ERROR_MESSAGES.INTERNAL_ERROR }).code(500);
            }
        }
    }
];