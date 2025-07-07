const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/mailerController');

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await sendEmail(to, subject, html);
    res.json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Erreur d'envoi :", error);
    res.status(500).json({ error: "Échec de l'envoi" });
  }
});

module.exports = router;
