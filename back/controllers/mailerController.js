const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' }); // Chargement du fichier .env

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou utilise "smtp.gmail.com" avec host/port si tu veux plus de contrôle
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction d'envoi d'email
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nom de ton site" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email envoyé !");
    console.log("📨 ID du message :", info.messageId);
    console.log("📬 Destinataires :", info.envelope?.to || to);
    console.log("📄 Aperçu URL :", nodemailer.getTestMessageUrl(info) || "Pas d'aperçu disponible");

    return info;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
};

module.exports = { sendEmail };
