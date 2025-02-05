'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {
    static get name() {
        return 'mailService'; // Nom du service pour Schmervice
    }
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true pour 465, false pour les autres ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendMail(to, subject, text, html) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Support" <${process.env.SMTP_USER}>`, // L'expéditeur
                to, // Le destinataire
                subject, // Sujet
                text, // Corps en texte brut
                html // Corps en HTML
            });

            console.log(`📧 Email envoyé : ${info.messageId}`);
            console.log(`📥 Prévisualisation : ${nodemailer.getTestMessageUrl(info)}`);
        } catch (error) {
            console.error(`❌ Erreur lors de l'envoi de l'e-mail : ${error.message}`);
        }
    }
}

