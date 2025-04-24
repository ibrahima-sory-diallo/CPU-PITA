const express = require('express')
const router = express.Router()

const paragrapheMerController = require('../controllers/paragrapheMerController')
const Article = require('../models/articleModel')  // Remplacé Chapitre par Article
const paragraphe = require('../models/paragrapheModel')

router.post('/createParagrapheMer/:articleId', paragrapheMerController.createParagrapheMer)  // Remplacé chapitreId par articleId

// // Afficher tous les paragraphes
// router.get('/getParagraphesByArticle/:articleId', paragrapheController.getParagraphesByArticle)  // Remplacé chapitreId par articleId

// // Route pour récupérer la prévision et l'émission totales
// router.get('/article/:articleId/totals', paragrapheController.getPrevisionsEtEmissions)  // Remplacé chapitreId par articleId

module.exports = router
