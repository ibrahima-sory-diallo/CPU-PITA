const express =require('express')
const router =express.Router()
const Section = require("../models/sectionModel");  // Remplacez par le bon chemin du modèle
const Chapitre = require("../models/chapitreModel");  // Remplacez par le bon chemin du modèle
const Paragraphe = require("../models/paragrapheModel");  // Remplacez par le bon chemin du modèle
const sectionController = require('../controllers/sectionController')


// Créer une section
router.post('/creerSection/:comptableId', sectionController.createSection);
// Route pour obtenir toutes les sections d'une année spécifique
router.get('/sections/annee/:annee', sectionController.getAllSectionsByYear);

// Récupérer toutes les sections avec pagination
router.get('/sections', sectionController.getAllSections);

// Récupérer une section par son ID
router.get('/section/:sectionId', sectionController.getSectionById);

// Mettre à jour une section
router.put('/section/:sectionId', sectionController.updateSection);

// Supprimer une section
router.delete('/section/:sectionId', sectionController.deleteSection);

// Récupérer des sections par nom
router.get('/sections/name/:name', sectionController.getSectionsByName);
  


module.exports = router