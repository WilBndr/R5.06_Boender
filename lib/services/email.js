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
                user: 'judson.botsford@ethereal.email',
                pass: 'ZrdNeQ11yTbZju4WVN'
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
    async sendEmail(to, subject, text) {
        try {
            const mailOptions = {
                from: '"Mon Service " <judson.botsford@ethereal.email>',
                to,
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

    async broadcastEmail(subject, text, users) {
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
