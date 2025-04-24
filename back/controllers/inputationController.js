const InputationService = require('../services/inputation.services');
const Chapitre = require('../models/chapitreModel');
const Article = require('../models/articleModel');
const Paragraphe = require('../models/paragrapheModel');
const Section = require('../models/sectionModel'); // Ajoute cette ligne
const ParagrapheMer = require('../models/paragrapheMerModel'); // adapte le chemin si besoin
const Inputation = require('../models/inputationModel');  // Assure-toi que le chemin est correct


// Créer une imputation
module.exports.createInputation = async (req, res) => {
  try {
      const { paragrapheId } = req.params;  // On récupère l'ID du paragraphe depuis les paramètres de l'URL
      const inputationData = req.body;  // On récupère les données de l'imputation envoyées dans le corps de la requête

      // Appel au service pour créer l'imputation
      const inputation = await InputationService.createInputation(paragrapheId, inputationData);

      // Réponse en cas de succès
      res.status(201).json({
          message: 'Imputation créée avec succès',
          inputation,
      });
  } catch (error) {
      // Gestion des erreurs
      res.status(400).json({
          error: error.message,
      });
  }
};

// Récupérer les imputations d'un paragraphe
module.exports.getInputationsByParagraphe = async (req, res) => {
    const { paragrapheId } = req.params;  // Récupère l'ID du paragraphe depuis les paramètres de la requête
  
    try {
      // Appeler le service pour récupérer les imputations
      const inputations = await InputationService.getInputationsByParagraphe(paragrapheId);
  
      // Renvoie les imputations au client
      res.status(200).json({ inputations });
    } catch (error) {
      // Si une erreur se produit, renvoyer un message d'erreur
      res.status(500).json({ error: error.message });
    }
};

// Mise à jour d'une imputation
module.exports.updateInputationByParagraphe = async (req, res) => {
  try {
    const inputation = await InputationService.updateInputation(req.params.inputationId, req.body);
    res.status(200).json({
      message: 'Imputation mise à jour avec succès',
      inputation
    });
  } catch (error) {
    console.error("Erreur dans updateInputationByParagraphe :", error); // Ajout utile
    res.status(500).json({ message: error.message });
  }
};

// Suppression d'une imputation
module.exports.deleteInputationByParagraphe = async (req, res) => {
  try {
    const response = await InputationService.deleteInputation(req.params.inputationId); // ✅ Correction ici
    res.status(200).json({
      message: 'Imputation supprimée avec succès',
      response
    });
  } catch (error) {
    console.error("Erreur dans deleteInputationByParagraphe :", error); // Ajout utile
    res.status(500).json({ message: error.message });
  }
};


const mongoose = require('mongoose');

module.exports.getInputationsParMoisParSection = async (req, res) => {
  try {
    const sectionQuery = req.query.section;

    const matchSection = sectionQuery
      ? { 'section.name': sectionQuery }
      : {};

    const result = await Inputation.aggregate([
      {
        $lookup: {
          from: 'paragraphes',
          localField: 'paragrapheId',
          foreignField: '_id',
          as: 'paragraphe'
        }
      },
      { $unwind: '$paragraphe' },
      {
        $lookup: {
          from: 'paragraphemers',
          localField: 'paragraphe.paragrapheMerId',
          foreignField: '_id',
          as: 'paragrapheMer'
        }
      },
      { $unwind: '$paragrapheMer' },
      {
        $lookup: {
          from: 'articles',
          localField: 'paragrapheMer.articleId',
          foreignField: '_id',
          as: 'article'
        }
      },
      { $unwind: '$article' },
      {
        $lookup: {
          from: 'chapitres',
          localField: 'article.chapitreId',
          foreignField: '_id',
          as: 'chapitre'
        }
      },
      { $unwind: '$chapitre' },
      {
        $lookup: {
          from: 'sections',
          localField: 'chapitre.sectionId',
          foreignField: '_id',
          as: 'section'
        }
      },
      { $unwind: '$section' },
      {
        $match: matchSection
      },
      {
        $addFields: {
          mois: {
            $cond: [
              { $ifNull: ['$mois', false] },
              '$mois',
              {
                $dateToString: {
                  format: '%B',
                  date: { $toDate: '$date' } // conversion explicite
                }
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: { section: '$section.name', mois: '$mois' },
          inputations: { $push: '$$ROOT' },
          total: { $sum: '$montant' }
        }
      },
      {
        $group: {
          _id: '$_id.section',
          moisData: {
            $push: {
              mois: '$_id.mois',
              total: '$total',
              inputations: '$inputations'
            }
          }
        }
      }
    ]);

    // Réorganiser en objet comme avant
    const formattedResult = {};
    result.forEach(section => {
      formattedResult[section._id] = {};
      section.moisData.forEach(moisEntry => {
        formattedResult[section._id][moisEntry.mois] = moisEntry.inputations;
      });
    });

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error('Erreur lors de la récupération des inputations par section:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};


module.exports.getSoldeAnneePrecedente = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Récupérer toutes les imputations de l’année précédente
    const imputations = await Inputation.find({
      date: {
        $gte: new Date(`${previousYear}-01-01`),
        $lte: new Date(`${previousYear}-12-31`),
      },
    });

    // Séparer recettes et dépenses
    const recettes = imputations
      .filter(i => i.section?.toLowerCase().includes("recette"))
      .reduce((sum, i) => sum + i.montant, 0);

    const depenses = imputations
      .filter(i => i.section?.toLowerCase().includes("dépense") || i.section?.toLowerCase().includes("depense"))
      .reduce((sum, i) => sum + i.montant, 0);

    const solde = recettes - depenses;

    res.status(200).json({ solde, recettes, depenses });
  } catch (error) {
    console.error("Erreur lors du calcul du solde de l'année précédente :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};