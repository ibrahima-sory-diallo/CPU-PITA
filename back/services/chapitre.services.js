const Section = require('../models/sectionModel');
const Chapitre = require('../models/chapitreModel');
const Article = require('../models/articleModel');
const Paragraphe = require('../models/paragrapheModel');
const mongoose = require('mongoose');

async function createChapitre(sectionId, chapitreData) {
    try {
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            throw new Error("L'ID de la section est invalide.");
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            throw new Error('Section non trouvée');
        }

        const chapitre = new Chapitre({
            ...chapitreData,
            sectionId: sectionId
        });

        await chapitre.save();
        section.chapitres.push(chapitre._id);
        await section.save();

        console.log('✅ Chapitre ajouté avec succès');
        return chapitre;
    } catch (error) {
        console.log('❌ Erreur lors de l\'ajout du chapitre', error.message);
        throw new Error(error.message);
    }
}


async function updateChapitre(chapitreId, chapitreData) {
    try {
        if (!mongoose.Types.ObjectId.isValid(chapitreId)) {
            throw new Error("L'ID du chapitre est invalide.");
        }

        const chapitre = await Chapitre.findByIdAndUpdate(
            chapitreId,
            { ...chapitreData },
            { new: true, runValidators: true } // Retourne le chapitre mis à jour
        );

        return chapitre;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllChapitres() {
    try {
        const chapitres = await Chapitre.find().populate('sectionId'); // Si besoin de détails de la section
        return chapitres;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getChapitresBySection(sectionId) {
    try {
        // Vérifier si l'ID de la section est valide
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            throw new Error("L'ID de la section est invalide.");
        }

        // Trouver la section
        const section = await Section.findById(sectionId);
        if (!section) {
            throw new Error("Section non trouvée.");
        }

        // Trouver les chapitres associés à cette section
        const chapitres = await Chapitre.find({ sectionId });

        // Si aucun chapitre n'est trouvé, retourner un message approprié
        if (chapitres.length === 0) {
            throw new Error("Aucun chapitre trouvé pour cette section.");
        }

        return chapitres; // Retourner les chapitres trouvés
    } catch (error) {
        throw new Error(error.message);
    }
}
async function getSectionWithChapitres(sectionId, annee) {
    try {
        const section = await Section.findById(sectionId)
            .populate({
                path: 'chapitres',
                model: 'Chapitre',
                match: { annee: annee },  // Filtrer les chapitres par l'année
                populate: {
                    path: 'articles',
                    model: 'Article',
                    match: { annee: annee },  // Filtrer les articles par l'année
                    populate: {
                        path: 'paragraphesMers',
                        model: 'ParagrapheMer',
                        match: { annee: annee }, // Filtrer les paragraphesMers par l'année
                        populate: {
                            path: 'paragraphes',
                            model: 'Paragraphe',
                            match: { annee: annee }, // Filtrer les paragraphes par l'année
                            populate: {
                                path: 'inputations',
                                model: 'Inputation',
                                match: { annee: annee }  // Filtrer les inputations par l'année
                            }
                        }
                    }
                }
            });

        if (!section) {
            throw new Error('Section non trouvée');
        }

        return section;
    } catch (error) {
        throw error;
    }
}






module.exports = { 
    createChapitre, 
    updateChapitre, 
    getAllChapitres, 
    getChapitresBySection, 
    getSectionWithChapitres,
};
