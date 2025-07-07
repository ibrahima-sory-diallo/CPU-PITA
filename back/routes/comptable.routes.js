const express = require("express");
const mongoose = require("mongoose");
const Comptable = require("../models/comptableModel");
const Section = require("../models/sectionModel");
const Chapitre = require("../models/chapitreModel");
const Article = require("../models/articleModel");
const ParagrapheMer = require("../models/paragrapheMerModel");
const Paragraphe = require("../models/paragrapheModel");

const router = express.Router();

// Clôturer une année et créer la suivante
// ... (importations inchangées)

router.post("/cloturer/:anneeActuelle", async (req, res) => {
  const { anneeActuelle } = req.params;
  const anneeActuelleNum = parseInt(anneeActuelle, 10);

  if (isNaN(anneeActuelleNum)) {
    return res.status(400).json({ error: "Paramètre d'année invalide." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const nouvelleAnneeNum = anneeActuelleNum + 1;

    const anneeExistante = await Comptable.findOne({ annee: anneeActuelleNum }).session(session);
    if (!anneeExistante) {
      await session.abortTransaction();
      return res.status(404).json({ error: `L'année ${anneeActuelleNum} n'existe pas.` });
    }

    if (anneeExistante.cloture) {
      await session.abortTransaction();
      return res.status(400).json({ error: `L'année ${anneeActuelleNum} est déjà clôturée.` });
    }

    const existeDeja = await Comptable.findOne({ annee: nouvelleAnneeNum }).session(session);
    if (existeDeja) {
      await session.abortTransaction();
      return res.status(400).json({ error: `L'année ${nouvelleAnneeNum} existe déjà.` });
    }

    // Clôturer l'année actuelle
    anneeExistante.cloture = true;
    anneeExistante.dateCloture = new Date();
    await anneeExistante.save({ session });

    // Créer la nouvelle année
    const nouvelleAnnee = new Comptable({
      annee: nouvelleAnneeNum,
      cloture: false,
      sections: []
    });
    await nouvelleAnnee.save({ session });

    const sections = await Section.find({ annee: anneeActuelleNum }).session(session);
    const nouvelleSectionIds = [];

    for (const section of sections) {
      const newSection = new Section({
        name: section.name,
        titre: section.titre,
        annee: nouvelleAnneeNum,
        ComptableId: nouvelleAnnee._id,
        statut: "ouvert",
        chapitres: []
      });
      await newSection.save({ session });
      nouvelleSectionIds.push(newSection._id);

      const chapitres = await Chapitre.find({ sectionId: section._id }).session(session);
      for (const chapitre of chapitres) {
        const newChapitre = new Chapitre({
          numero: chapitre.numero,
          nom: chapitre.nom,
          annee: nouvelleAnneeNum,
          sectionId: newSection._id,
          statut: "ouvert",
          articles: []
        });
        await newChapitre.save({ session });

        newSection.chapitres.push(newChapitre._id);

        const articles = await Article.find({ chapitreId: chapitre._id }).session(session);
        for (const article of articles) {
          const newArticle = new Article({
            numero: article.numero,
            nom: article.nom,
            annee: nouvelleAnneeNum,
            chapitreId: newChapitre._id,
            statut: "ouvert",
            paragraphesMers: []
          });
          await newArticle.save({ session });

          newChapitre.articles.push(newArticle._id);

          const paragraphesMer = await ParagrapheMer.find({ articleId: article._id }).session(session);
          for (const pm of paragraphesMer) {
            const newParagrapheMer = new ParagrapheMer({
              numero: pm.numero,
              nom: pm.nom,
              annee: nouvelleAnneeNum,
              articleId: newArticle._id,
              statut: "ouvert",
              paragraphes: []
            });
            await newParagrapheMer.save({ session });

            newArticle.paragraphesMers.push(newParagrapheMer._id);

            const paragraphes = await Paragraphe.find({ paragrapheMerId: pm._id }).session(session);
            for (const p of paragraphes) {
              const newParagraphe = new Paragraphe({
                numero: p.numero,
                nom: p.nom,
                annee: nouvelleAnneeNum,
                paragrapheMerId: newParagrapheMer._id,
                statut: "ouvert"
              });
              await newParagraphe.save({ session });

              newParagrapheMer.paragraphes.push(newParagraphe._id);
            }

            await newParagrapheMer.save({ session });
          }

          await newArticle.save({ session });
        }

        await newChapitre.save({ session });
      }

      await newSection.save({ session });
    }

    nouvelleAnnee.sections = nouvelleSectionIds;
    await nouvelleAnnee.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: `Année ${anneeActuelleNum} clôturée avec succès. Année ${nouvelleAnneeNum} créée.`
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur de duplication :", error);
    return res.status(500).json({ error: "Erreur de duplication : " + error.message });
  }
});


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


// Récupération de toutes les années
router.get("/tousAnnee", async (req, res) => {
  try {
    const comptables = await Comptable.find().sort({ annee: 1 });
    res.json(comptables);
  } catch (error) {
    console.error("Erreur lors de la récupération des années :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des années comptables." });
  }
});

module.exports = router;
