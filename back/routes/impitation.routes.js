const express = require('express');
const router = express.Router();
const inputationController = require('../controllers/inputationController');

// Route pour créer une imputation dans un paragraphe
router.post('/createInputation/:paragrapheId', inputationController.createInputation);

router.get('/getInputations/:paragrapheId', inputationController.getInputationsByParagraphe);
router.get('/getInputationsParMoisParSection', inputationController.getInputationsParMoisParSection);
router.get('/getSoldeAnneePrecedente', inputationController.getSoldeAnneePrecedente);
router.patch('/updateInputation/:inputationId', inputationController.updateInputationByParagraphe);
router.delete('/deleteInputation/:inputationId', inputationController.deleteInputationByParagraphe);



module.exports = router;
