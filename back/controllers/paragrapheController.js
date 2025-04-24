const ParagrapheService = require('../services/paragraphe.services');  // Service à mettre à jour également

// Contrôleur paragrapheController.js
module.exports.createParagraphe = async (req, res) => {
    try {
        const { paragrapheMerId } = req.params;
        const paragrapheData = req.body;

        const paragraphe = await ParagrapheService.createParagraphe(paragrapheMerId, paragrapheData);

        res.status(201).json({
            message: "Paragraphe créé avec succès",
            paragraphe,
        });
    } catch (error) {
        console.error("Erreur création paragraphe:", error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports.updateParagraphe = async (req, res) => {
    try {
        const { paragrapheId } = req.params;
        const paragrapheData = req.body;

        const updatedParagraphe = await ParagrapheService.updateParagraphe(paragrapheId, paragrapheData);

        if (!updatedParagraphe) {
            return res.status(404).json({ error: "Paragraphe non trouvé ou échec de la mise à jour." });
        }

        res.status(200).json({
            message: "Paragraphe mis à jour avec succès",
            paragraphe: updatedParagraphe,
        });
    } catch (error) {
        console.error("Erreur modification paragraphe:", error.message);
        res.status(400).json({ error: error.message });
    }
};



module.exports.getParagraphesByParagrapheMer= async (req, res) => {
    try {
        const { paragrapheMerId } = req.params;  // Récupérer l'ID de l'article depuis l'URL
        const paragraphes = await ParagrapheService.getParagraphesByParagrapheMer(paragrapheMerId);

        res.status(200).json({ message: "Paragraphes récupérés avec succès", paragraphes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getPrevisionsEtEmissions = async (req, res) => {
    try {
        const { paragrapheMerId } = req.params;  // Récupérer l'ID de l'article depuis l'URL
        const totals = await ParagrapheService.getPrevisionsEtEmissionsByParagrapheMer(paragrapheMerId);

        res.status(200).json({
            message: "Prévision et émission récupérées avec succès",
            totals
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
