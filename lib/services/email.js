'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {
    constructor(...args) {
        super(...args);

        // Utiliser des variables d'environnement pour éviter d'exposer des données sensibles
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: process.env.MAIL_PORT || 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendEmail(to, subject, text, attachmentPath = null) {
        try {
            const mailOptions = {
                from: `"Mon Service" <${process.env.MAIL_USER}>`,
                to,
                subject,
                text,
                html: `<p>${text}</p>`
            };

            if (attachmentPath) {
                mailOptions.attachments = [{
                    filename: "films_export.csv",
                    path: attachmentPath
                }];
            }

            const info = await this.transporter.sendMail(mailOptions);
            console.log('📧 Email envoyé avec succès :', info.messageId);
            return info;
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de l\'email :', error);
            throw error;
        }
    }

    /*
    Envoi un email à plusieurs adresses renseignées dans le tableau users
    @param {string[]}
    @param {string} subject - Le sujet de l'email
    @param {string} text - Le contenu de l'email
    @returns {Promise<Object>} - L'objet de réponse de nodemailer
     */
    async broadcastEmail(users, subject, text) {
        try {
            const mailOptions = {
                from: '"Mon Service " <judson.botsford@ethereal.email>',
                to: users.join(','),
                subject,
                text,
                html: `<p>${text}</p>` // Version HTML
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email envoyé avec succès :', info.messageId);
            return info;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
            throw error;
        }
    }
};
