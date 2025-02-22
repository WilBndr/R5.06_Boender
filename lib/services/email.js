'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    constructor(...args) {
        super(...args);

        // Configuration correcte pour Ethereal Email
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'linwood79@ethereal.email',
                pass: '371cC8QMt6pf36tUUa'
            }
        });
    }


    /*
    Envoi un email à l'adresse spécifiée
    @param {string} to - L'adresse email du destinataire
    @param {string} subject - Le sujet de l'email
    @param {string} text - Le contenu de l'email
    @returns {Promise<Object>} - L'objet de réponse de nodemailer
    */
    async sendEmail(to, subject, text, attachmentPath = null) {
        try {
            const mailOptions = {
                from: '"Mon Service" <linwood79@ethereal.email>',
                to,
                subject,
                text,
                html: `<p>${text}</p>` // Version HTML
            };

            // Ajouter une pièce jointe si fournie
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
