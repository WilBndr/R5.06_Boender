'use strict'

const Joi = require('joi')

module.exports = [
    {
        method: 'POST',
        path: '/send-email',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().example('test@example.com')
                        .description('L\'adresse email du destinataire'),
                    subject: Joi.string().min(3).required().example('Sujet de l\'email')
                        .description('Le sujet de l\'email'),
                    message: Joi.string().min(5).required().example('Ceci est un message.')
                        .description('Le contenu du message à envoyer')
                })
            }
        },
        handler: async (request, h) => {
            const { email, subject, message } = request.payload;

            try {
                const mailService = request.services().mailService;
                await mailService.sendEmail(email, subject, message);

                return h.response({ message: 'Email envoyé avec succès !' }).code(200);
            } catch (error) {
                return h.response({ error: 'Échec de l\'envoi de l\'email.', details: error.message }).code(500);
            }
        }
    }
    ]