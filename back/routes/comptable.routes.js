const express = require("express");
const mongoose = require("mongoose");
const Comptable = require("../models/comptableModel");
const Section = require("../models/sectionModel");
const Chapitre = require("../models/chapitreModel");
const Article = require("../models/articleModel");
const Paragraphe = require("../models/paragrapheModel");
const Inputation = require("../models/inputationModel");

const router = express.Router(); // ✅ Créer un router spécifique pour ce fichier

// Route pour créer une nouvelle année comptable
router.post("/creerAnnee/:annee", async (req, res) => {
  const { annee } = req.params;
  
  try {
    // Vérifier si l'année existe déjà
    const existante = await Comptable.findOne({ annee });
    if (existante) {
      return res.status(400).json({ message: `L'année ${annee} existe déjà.` });
    }

    // Créer une nouvelle année comptable
    const nouvelleAnnee = new Comptable({ annee, cloture: false });
    await nouvelleAnnee.save();

    res.status(201).json({ message: `L'année ${annee} a été créée avec succès.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Route pour obtenir toutes les années comptables
router.get('/tousAnnee', async (req, res) => {
  try {
    const comptables = await Comptable.find().populate('sections');
    res.json(comptables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des années comptables.' });
  }
});

router.post("/cloturer/:annee", async (req, res) => {
  const { annee } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Vérification si l'année existe et n'est pas déjà clôturée
    const exercice = await Comptable.findOne({ annee }).session(session);
    if (!exercice) {
      // L'année n'existe pas dans la base
      throw new Error(`L'année ${annee} n'existe pas.`);
    }

    if (exercice.cloture) {
      // L'année est déjà clôturée
      throw new Error(`L'année ${annee} est déjà clôturée.`);
    }

    // Clôturer l'exercice comptable
    await Comptable.updateOne(
      { annee },
      { $set: { cloture: true, dateCloture: new Date() } },
      { session }
    );

    // Récupérer toutes les sections liées à l'année
    const sections = await Section.find({ annee }).session(session);
    if (!sections || sections.length === 0) {
      throw new Error(`Aucune section trouvée pour l'année ${annee}.`);
    }

    // Clôturer toutes les sections de l'année
    await Section.updateMany(
      { annee },
      { $set: { statut: "clôturée", dateCloture: new Date() } },
      { session }
    );

    // Clôturer les chapitres, articles, paragraphes et imputations
    for (let section of sections) {
      await Chapitre.updateMany(
        { _id: { $in: section.chapitres } },
        { $set: { statut: "clôturé", dateCloture: new Date() } },
        { session }
      );
      for (let chapitreId of section.chapitres) {
        const articles = await Article.find({ chapitreId }).session(session);
        await Article.updateMany(
          { chapitreId },
          { $set: { statut: "clôturé", dateCloture: new Date() } },
          { session }
        );
        for (let article of articles) {
          const paragraphs = await Paragraphe.find({ articleId: article._id }).session(session);
          await Paragraphe.updateMany(
            { articleId: article._id },
            { $set: { statut: "clôturé", dateCloture: new Date() } },
            { session }
          );
          for (let paragraphe of paragraphs) {
            await Inputation.updateMany(
              { paragrapheId: paragraphe._id },
              { $set: { statut: "clôturé", dateCloture: new Date() } },
              { session }
            );
          }
        }
      }
    }

    // Commit de la transaction si tout s'est bien passé
    await session.commitTransaction();
    session.endSession();

    res.json({ message: `L'année ${annee} a été clôturée avec succès.` });
  } catch (error) {
    // En cas d'erreur, on annule la transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur lors de la clôture de l'année:", error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/dupliquer/:anneeSource/:anneeCible', async (req, res) => {
  const { anneeSource, anneeCible } = req.params;

  try {
    // Vérifie si une année cible existe déjà
    const comptableExist = await Comptable.findOne({ annee: anneeCible });
    if (comptableExist) {
      return res.status(400).json({ message: `L'année ${anneeCible} existe déjà.` });
    }

    // Récupère l'année source avec ses sections
    const comptableSource = await Comptable.findOne({ annee: anneeSource }).populate({
      path: 'sections',
      populate: {
        path: 'chapitres',
        populate: {
          path: 'articles',
        }
      }
    });

    if (!comptableSource) {
      return res.status(404).json({ message: `Aucune donnée trouvée pour l'année ${anneeSource}` });
    }

    const newSectionIds = [];

    // ➤ Dupliquer chaque section
    for (const section of comptableSource.sections) {
      const newSection = new Section({
        nom: section.nom,
        titre: section.titre,
        statut: section.statut,
        annee: parseInt(anneeCible),
        chapitres: []
      });

      // ➤ Dupliquer chaque chapitre de la section
      for (const chapitre of section.chapitres) {
        const newChapitre = new Chapitre({
          numero: chapitre.numero,
          nom: chapitre.nom,
          prevision: chapitre.prevision,
          emission: 0,
          recouvrement: 0,
          annee: parseInt(anneeCible),
          statut: 'active',
          sectionId: newSection._id,
          articles: []
        });

        // ➤ Dupliquer chaque article du chapitre
        for (const article of chapitre.articles) {
          const newArticle = new Article({
            numero: article.numero,
            nom: article.nom,
            annee: parseInt(anneeCible),
            statut: 'active',
            chapitreId: newChapitre._id,
          });

          await newArticle.save();
          newChapitre.articles.push(newArticle._id);
        }

        await newChapitre.save();
        newSection.chapitres.push(newChapitre._id);
      }

      await newSection.save();
      newSectionIds.push(newSection._id);
    }

    // ➤ Crée la nouvelle année comptable
    const newComptable = new Comptable({
      annee: parseInt(anneeCible),
      cloture: false,
      dateCloture: null,
      sections: newSectionIds
    });

    await newComptable.save();

    res.status(201).json({ message: `Données de ${anneeSource} dupliquées avec succès vers ${anneeCible}.` });

  } catch (error) {
    console.error("Erreur de duplication :", error);
    res.status(500).json({ message: "Erreur interne lors de la duplication." });
  }
});


// Route pour récupérer les données de l'année comptable
router.get("/donnees/:annee", async (req, res) => {
  const { annee } = req.params;

  try {
    const sections = await Section.find({ annee }).populate({
      path: "chapitres",
      populate: {
        path: "articles",
        populate: {
          path: "paragraphes",
          populate: {
            path: "inputations",
          },
        },
      },
    });

    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:nouvelleAnnee/:sectionId", async (req, res) => {
  const { nouvelleAnnee, sectionId } = req.params;

  try {
    // Récupérer la section spécifique pour l'année réouverte
    const section = await Section.findById(sectionId)
      .populate({
        path: 'chapitres',
        model: 'Chapitre',
        populate: {
          path: 'articles',
          model: 'Article',
          populate: {
            path: 'paragraphes',
            model: 'Paragraphe',
            populate: {
              path: 'inputations',
              model: 'Inputation'
            }
          }
        }
      });

    if (!section) {
      return res.status(404).json({ message: "Section non trouvée pour l'année réouverte." });
    }

    // Vérification que la section correspond bien à l'année réouverte
    if (section.annee !== nouvelleAnnee) {
      return res.status(400).json({ message: `La section ne correspond pas à l'année ${nouvelleAnnee}.` });
    }

    // Structurer la réponse en incluant les chapitres, articles, paragraphes et imputations
    const reponse = {
      sectionId: section._id,
      annee: section.annee,
      chapitres: section.chapitres.map(chapitre => ({
        chapitreId: chapitre._id,
        prevision: chapitre.prevision,
        emission: chapitre.emission,
        recouvrement: chapitre.recouvrement,
        articles: chapitre.articles.map(article => ({
          articleId: article._id,
          statut: article.statut,
          paragraphes: article.paragraphes.map(paragraphe => ({
            paragrapheId: paragraphe._id,
            prevision: paragraphe.prevision,
            emission: paragraphe.emission,
            recouvrement: paragraphe.recouvrement,
            imputations: paragraphe.inputations.map(inputation => ({
              inputationId: inputation._id,
              statut: inputation.statut,
              prevision: inputation.prevision,
              emission: inputation.emission,
              recouvrement: inputation.recouvrement,
              champ1: inputation.champ1,
              champ2: inputation.champ2
            }))
          }))
        }))
      })
)};

    // Renvoyer la réponse structurée
    res.json(reponse);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'année réouverte:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
