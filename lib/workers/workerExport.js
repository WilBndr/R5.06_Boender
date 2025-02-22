'use strict';

require("dotenv").config();
const amqp = require("amqplib");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const MailService = require('../services/email');  // Assure-toi que ce chemin est correct

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const queue = "export_csv";

// Générer un fichier CSV
const exportFilmsToCSV = async (films) => {
    const parser = new Parser();
    const csv = parser.parse(films);

    const filePath = path.join(__dirname, "../../exports/films_export.csv");
    fs.writeFileSync(filePath, csv);

    console.log(`📁 Export CSV généré : ${filePath}`);

    return filePath;
};

// Consommer les messages RabbitMQ
const consumeMessages = async () => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    console.log("📩 Worker en attente des demandes d'export...");

    // Crée une instance de MailService dans le worker
    const mailService = new MailService();  // Crée l'instance

    await channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());

            const email = messageContent.email;
            const films = messageContent.films;

            console.log(`📥 Demande reçue pour ${email}`);

            try {
                const filePath = await exportFilmsToCSV(films);
                // Utiliser l'instance de MailService pour envoyer l'email
                await mailService.sendEmail(email, 'Export de vos films', 'Veuillez trouver en pièce jointe le fichier CSV demandé.', filePath);
            } catch (error) {
                console.error("❌ Erreur traitement export :", error);
            }

            channel.ack(msg); // Confirmer que le message a été traité
        }
    });
};

// Lancer le worker
consumeMessages();
