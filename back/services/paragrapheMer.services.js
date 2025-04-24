const ParagrapheMer = require('../models/paragrapheMerModel');
const Article = require('../models/articleModel');

class ParagrapheMerService {
    static async createParagrapheMer(articleId, paragrapheMerData) {
        try {
            // Vérifier si l'article existe
            const article = await Article.findById(articleId);
            if (!article) {
                throw new Error("L'article spécifié n'existe pas.");
            }

            // Ajouter l'ID de l'article au paragraphe
            paragrapheMerData.articleId = articleId;

            // Créer le paragraphe
            const paragrapheMer = new ParagrapheMer(paragrapheMerData);
            await paragrapheMer.save();

            // Ajouter le paragraphe à l'article
            article.paragraphesMers.push(paragrapheMer._id);
            await article.save();

            return paragrapheMer;
        } catch (error) {
            throw new Error(`Erreur lors de la création du paragraphe: ${error.message}`);
        }
    }

    // static async getParagraphesByArticle(articleId) {
    //     try {
    //         const paragraphes = await Paragraphe.find({ articleId });
    //         return paragraphes;
    //     } catch (error) {
    //         throw new Error(`Erreur lors de la récupération des paragraphes: ${error.message}`);
    //     }
    // }

    // static async getPrevisionsEtEmissionsByArticle(articleId) {
    //     try {
    //         // Agrégation pour calculer la somme des prévisions et des émissions
    //         const result = await Paragraphe.aggregate([
    //             { $match: { articleId } },
    //             {
    //                 $group: {
    //                     _id: "$articleId",
    //                     totalPrevision: { $sum: "$prevision" },
    //                     totalEmission: { $sum: "$emission" }
    //                 }
    //             }
    //         ]);

    //         if (result.length === 0) {
    //             return {
    //                 totalPrevision: 0,
    //                 totalEmission: 0
    //             };
    //         }

    //         return result[0];
    //     } catch (error) {
    //         throw new Error(`Erreur lors de la récupération des prévisions et émissions: ${error.message}`);
    //     }
    // }
}

module.exports = ParagrapheMerService;
