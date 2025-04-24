const mongoose = require('mongoose');
const Article = require('../models/articleModel');
const Chapitre = require('../models/chapitreModel');

class ArticleService {
    // Créer un nouvel article
    static async createArticle(chapitreId, articleData) {
        try {
            // Vérification de l'ID du chapitre
            if (!mongoose.Types.ObjectId.isValid(chapitreId)) {
                throw new Error("L'ID du chapitre est invalide.");
            }

            // Vérifier que le chapitre existe
            const chapitre = await Chapitre.findById(chapitreId);
            if (!chapitre) {
                throw new Error("Chapitre non trouvé.");
            }

            // Créer l'article
            const article = new Article({
                ...articleData,
                chapitreId: chapitreId
            });

            // Sauvegarder l'article
            await article.save();

            // Ajouter l'article à la liste des articles du chapitre
            chapitre.articles.push(article._id);
            await chapitre.save();

            console.log('Article ajouté au chapitre');
            return article;
        } catch (error) {
            console.log('Erreur lors de l\'ajout de l\'article :', error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = ArticleService;
