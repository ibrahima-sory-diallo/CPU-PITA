const Section = require('../models/sectionModel');
const Chapitre = require("../models/chapitreModel");
const Article = require("../models/articleModel");
const Paragraphe = require("../models/paragrapheModel");
const Comptable = require('../models/comptableModel');


module.exports.createSection = async (req, res) => {
    const { name, titre } = req.body;  // Récupérer le nom et le titre de la section
    const comptableId = req.params.comptableId;  // Récupérer l'ID de l'année depuis les paramètres de l'URL

    try {
        // Vérifier si le Comptable existe avec l'ID fourni
        const comptable = await Comptable.findById(comptableId);
        if (!comptable) {
            return res.status(400).json({ error: "Année comptable non trouvée." });
        }

        // Vérifier si l'année comptable est déjà clôturée
        if (comptable.cloture) {
            return res.status(400).json({
                error: `L'année ${comptable.annee} est déjà clôturée. Impossible d'ajouter une nouvelle section.`
            });
        }

        // Créer la nouvelle section et l'associer à l'année comptable
        const section = new Section({
            name,
            titre,
            ComptableId: comptable._id,  // Lier la section au Comptable par ID
            annee: comptable.annee,  // Lier l'année spécifique du comptable à la section
        });

        // Sauvegarder la section dans la base de données
        await section.save();

        // Ajouter la section à la liste des sections du Comptable
        comptable.sections.push(section._id);  // Associer la section à l'année comptable
        await comptable.save();  // Sauvegarder l'année mise à jour avec la nouvelle section

        // Réponse avec les détails de la section créée
        res.status(200).json({ message: "Section créée avec succès", section });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Route pour obtenir toutes les sections d'une année spécifique
module.exports.getAllSectionsByYear = async (req, res) => {
    const { annee } = req.params;  // L'année est passée dans les paramètres
  
    try {
        // Trouver l'année comptable via l'année
        const comptable = await Comptable.findOne({ annee });

        // Si l'année comptable n'existe pas
        if (!comptable) {
            return res.status(404).json({ message: `Aucune année comptable trouvée pour l'année ${annee}.` });
        }

        // Trouver toutes les sections associées à cette année comptable
        const sections = await Section.find({ annee: comptable.annee }).populate('chapitres');  // Peupler les chapitres si nécessaire

        // Si aucune section n'est trouvée
        if (!sections || sections.length === 0) {
            return res.status(404).json({ message: `Aucune section trouvée pour l'année ${annee}.` });
        }

        // Retourner les sections trouvées
        res.status(200).json(sections);
    } catch (error) {
        console.error('Erreur lors de la récupération des sections:', error);
        res.status(500).json({ error: error.message });
    }
};


// Afficher toutes les sections avec pagination
module.exports.getAllSections = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Page et limit par défaut

    try {
        const sections = await Section.find()
            .skip((page - 1) * limit)  // Sauter les sections déjà récupérées
            .limit(limit);  // Limiter le nombre de sections par page
        res.status(200).json(sections);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer une section par son ID
module.exports.getSectionById = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Vérifier si l'ID est valide
        if (!sectionId || !sectionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "ID de section invalide" });
        }

        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({ error: "Section non trouvée" });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour une section
module.exports.updateSection = async (req, res) => {
    const sectionId = req.params.sectionId;
    const { name, titre } = req.body;

    try {
        // Vérifier si l'ID est valide
        if (!sectionId) {
            return res.status(400).json({ error: "L'ID de la section est requis." });
        }

        // Valider que le nom et le titre sont présents
        if (!name || !titre) {
            return res.status(400).json({ error: "Le nom et le titre sont requis pour mettre à jour la section." });
        }

        // Rechercher et mettre à jour la section
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { name, titre },
            { new: true, runValidators: true } // Retourne la version mise à jour
        );

        if (!section) {
            return res.status(404).json({ error: "Section non trouvée." });
        }

        res.status(200).json({ message: "Section mise à jour avec succès", section });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une section
module.exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Vérifier si l'ID est valide
        if (!sectionId || !sectionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "ID de section invalide" });
        }

        const section = await Section.findByIdAndDelete(sectionId);

        if (!section) {
            return res.status(404).json({ error: "Section non trouvée" });
        }

        res.status(200).json({ message: "Section supprimée avec succès", section });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer les sections par nom
module.exports.getSectionsByName = async (req, res) => {
    try {
        // Récupérer le nom depuis les paramètres de la requête
        const { name } = req.params;

        // Trouver toutes les sections qui correspondent au nom
        const sections = await Section.find({ name: name });

        if (sections.length === 0) {
            return res.status(404).json({ message: "Aucune section trouvée avec ce nom" });
        }

        res.status(200).json(sections);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
