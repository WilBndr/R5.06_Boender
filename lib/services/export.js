'use strict';

const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib');

module.exports = class ExportService extends Service {

    /*
    * Exporte les films de la BDD dans un fichier CSV et l'envoie par email a l'administrateur initiant l'export
    * @param {Object} user
    * @param {Array} films
    * @return {Promise}
     */
    async export(user,films) {
        console.log("📢 Demande d'export reçue de :", user.email);

        // Récupérer l'URL de RabbitMQ en gros le broker
        const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
        const queue = 'export_csv';

        try {
            // Connexion à RabbitMQ
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue, { durable: true });

            // Créer le message à envoyer a RabbitMQ
            const message = JSON.stringify({
                email: user.email,
                films: films  // Inclure les films dans le message
            });

            // Envoyer le message à la queue
            channel.sendToQueue(queue, Buffer.from(message), { persistent: true },films);

            console.log(`📤 Message envoyé à RabbitMQ pour ${user.email}`);

            // Fermer la connexion
            setTimeout(() => {
                connection.close();
            }, 500);

            return { message: "Export en cours, un email vous sera envoyé." };
        } catch (error) {
            console.error("❌ Erreur lors de l'export :", error);
            throw new Error("Impossible d'envoyer la demande d'export.");
        }
    }
};
