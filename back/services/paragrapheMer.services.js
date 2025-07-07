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
}

module.exports = ParagrapheMerService;
