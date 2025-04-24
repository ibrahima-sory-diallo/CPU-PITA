const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');

// Route pour créer un article, en passant l'ID du chapitre dans l'URL
router.post('/createArticle/:chapitreId', articleController.createArticle);


module.exports = router;
