const express = require('express')
const router = express.Router()

const chapitreController = require('../controllers/chapitreController')

router.post('/createChapitre/:sectionId', chapitreController.createChapitre)
// Route pour mettre à jour un chapitre
router.put('/updateChapitre/:chapitreId', chapitreController.updateChapitre);
// Route pour récupérer et afficher tous les chapitres
router.get('/getChapitresBySection/:sectionId', chapitreController.getChapitresBySection);

// ✅ Nouvelle route : récupérer une section avec ses chapitres, articles et paragraphes filtrés par année
router.get('/sectionDetails/:sectionId/:annee', chapitreController.getSectionWithChapitres);
router.get('/groupBySectionName', chapitreController.getChapitresGroupedBySectionName);


module.exports = router