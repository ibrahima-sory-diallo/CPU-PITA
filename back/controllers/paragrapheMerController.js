const ParagrapheMerService = require('../services/paragrapheMer.services');  // Service à mettre à jour également

module.exports.createParagrapheMer = async (req, res) => {
    try {
        const { articleId } = req.params;  // Récupérer l'ID de l'article depuis les paramètres de l'URL
        const paragrapheMerData = req.body;   // Récupérer les données du paragraphe depuis le corps de la requête

        // Appel du service pour créer le paragraphe
        const paragrapheMer = await ParagrapheMerService.createParagrapheMer(articleId, paragrapheMerData);

        res.status(201).json({ message: "Paragraphe créé avec succès", paragrapheMer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// module.exports.getParagraphesByArticle = async (req, res) => {
//     try {
//         const { articleId } = req.params;  // Récupérer l'ID de l'article depuis l'URL
//         const paragraphesMers = await ParagrapheMerService.getParagraphesByArticle(articleId);

//         res.status(200).json({ message: "Paragraphes récupérés avec succès", paragraphes });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// module.exports.getPrevisionsEtEmissions = async (req, res) => {
//     try {
//         const { articleId } = req.params;  // Récupérer l'ID de l'article depuis l'URL
//         const totals = await ParagrapheService.getPrevisionsEtEmissionsByArticle(articleId);

//         res.status(200).json({
//             message: "Prévision et émission récupérées avec succès",
//             totals
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
