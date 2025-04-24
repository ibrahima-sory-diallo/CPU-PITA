const express = require('express')
const router = express.Router()

const paragrapheController = require('../controllers/paragrapheController')

router.post('/createParagraphe/:paragrapheMerId', paragrapheController.createParagraphe)  // Remplacé chapitreId par articleId
// Route pour mettre à jour un paragraphe
router.put('/updateParagraphe/:paragrapheId', paragrapheController.updateParagraphe);


module.exports = router
