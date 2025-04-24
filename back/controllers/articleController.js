const ArticleService = require('../services/article.services'); // Assurez-vous que le chemin est correct

// Créer un nouvel article
module.exports.createArticle = async (req, res) => {
    try {
        const { chapitreId } = req.params; // Récupérer l'ID du chapitre depuis les paramètres de la route
        const articleData = req.body; // Récupérer les données de l'article depuis le corps de la requête

        // Vérification des données d'article
        if (!articleData.numero || !articleData.nom) {
            return res.status(400).json({
                error: "Les champs 'numero' et 'nom' sont requis."
            });
        }

        // Appeler le service pour créer l'article
        const article = await ArticleService.createArticle(chapitreId, articleData);

        // Retourner une réponse réussie
        res.status(201).json({
            message: "Article ajouté avec succès",
            article
        });
    } catch (error) {
        // Gérer les erreurs
        res.status(400).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack // Ajouter la stack uniquement en développement
        });
    }
};
