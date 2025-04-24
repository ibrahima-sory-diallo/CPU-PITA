const chapitreService = require('../services/chapitre.services'); // Importation correcte
const { getSectionWithChapitres } = require('../services/chapitre.services'); // Importation de la fonction du service
const Section = require('../models/sectionModel'); // Ajoute cette ligne

// Création d'un chapitre
module.exports.createChapitre = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const chapitreData = req.body;

        // Vérification si l'ID de la section est présent
        if (!sectionId) {
            return res.status(400).json({ error: "L'ID de la section est requis." });
        }

        // Appel du service pour créer le chapitre
        const chapitre = await chapitreService.createChapitre(sectionId, chapitreData);

        res.status(201).json({ message: "Chapitre ajouté avec succès", chapitre });
    } catch (error) {
        console.error('Erreur lors de la création du chapitre:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Mise à jour d'un chapitre
module.exports.updateChapitre = async (req, res) => {
    try {
        const { chapitreId } = req.params;
        const chapitreData = req.body;

        // Vérification si l'ID du chapitre est fourni
        if (!chapitreId) {
            return res.status(400).json({ error: "L'ID du chapitre est requis." });
        }

        // Mise à jour du chapitre via le service
        const chapitre = await chapitreService.updateChapitre(chapitreId, chapitreData);

        if (!chapitre) {
            return res.status(404).json({ error: "Chapitre non trouvé." });
        }

        res.status(200).json({ message: "Chapitre mis à jour avec succès", chapitre });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du chapitre:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Récupérer tous les chapitres
module.exports.getAllChapitres = async (req, res) => {
    try {
        const chapitres = await chapitreService.getAllChapitres();
        res.status(200).json({ message: "Chapitres récupérés avec succès", chapitres });
    } catch (error) {
        console.error('Erreur lors de la récupération des chapitres:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Récupérer tous les chapitres d'une section
module.exports.getChapitresBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Vérification si l'ID de la section est valide
        if (!sectionId) {
            return res.status(400).json({ error: "L'ID de la section est requis." });
        }

        // Appel du service pour récupérer les chapitres par section
        const chapitres = await chapitreService.getChapitresBySection(sectionId);

        if (chapitres.length === 0) {
            return res.status(404).json({ error: "Aucun chapitre trouvé pour cette section." });
        }

        res.status(200).json({ message: "Chapitres récupérés avec succès", chapitres });
    } catch (error) {
        console.error('Erreur lors de la récupération des chapitres d\'une section:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Récupérer une section avec ses chapitres
exports.getSectionWithChapitres = async (req, res) => {
    const { sectionId, annee } = req.params; // Récupérer l'id de la section et l'année depuis les paramètres de l'URL

    try {
        // Appel au service pour récupérer la section avec ses chapitres, articles, paragraphes, etc.
        const section = await getSectionWithChapitres(sectionId, parseInt(annee)); // Convertir l'année en nombre

        // Vérifier si la section a été trouvée
        if (!section) {
            return res.status(404).json({ error: 'Section non trouvée' });
        }

        // Retourner la section avec les chapitres, articles, paragraphes, et imputations
        return res.status(200).json({ section });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur dans le contrôleur getSectionWithChapitres:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports.getChapitresGroupedBySectionName = async (req, res) => {
    try {
      const sections = await Section.find()
        .populate({
          path: 'chapitres'
        });
  
      const grouped = {};
  
      sections.forEach(section => {
        const sectionName = section.name;
  
        if (!grouped[sectionName]) {
          grouped[sectionName] = [];
        }
  
        grouped[sectionName].push(...section.chapitres);
      });
  
      res.status(200).json(grouped);
    } catch (error) {
      console.error('Erreur lors de la récupération des chapitres groupés avec articles/paragraphes :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };

