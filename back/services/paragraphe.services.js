const ParagrapheMer = require('../models/paragrapheMerModel');
const Paragraphe = require('../models/paragrapheModel');


class ParagrapheService {
    static async createParagraphe(paragrapheMerId, paragrapheData) {
        try {
            const paragrapheMer = await ParagrapheMer.findById(paragrapheMerId);
            if (!paragrapheMer) {
                throw new Error("Le paragrapheMer spécifié n'existe pas.");
            }
    
            // Attacher l'ID du paragrapheMer
            paragrapheData.paragrapheMerId = paragrapheMerId;
    
            const paragraphe = new Paragraphe(paragrapheData);
            await paragraphe.save();
    
            paragrapheMer.paragraphes.push(paragraphe._id);
            await paragrapheMer.save();
    
            return paragraphe;
        } catch (error) {
            throw new Error(`Erreur lors de la création du paragraphe: ${error.message}`);
        }
    }


    static async updateParagraphe(paragrapheId, paragrapheData) {
        try {
            const paragraphe = await Paragraphe.findByIdAndUpdate(
                paragrapheId,
                { $set: paragrapheData },
                { new: true }
            );
    
            if (!paragraphe) {
                throw new Error("Le paragraphe spécifié n'existe pas.");
            }
    
            return paragraphe;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du paragraphe: ${error.message}`);
        }
    }
    
    

    static async getParagraphesByArticle(pargrapheMerId) {
        try {
            const paragraphes = await Paragraphe.find({ pargrapheMerId });
            return paragraphes;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des paragraphes: ${error.message}`);
        }
    }

    static async getPrevisionsEtEmissionsByParagrapheMer(pargrapheMerId) {
        try {
            // Agrégation pour calculer la somme des prévisions et des émissions
            const result = await Paragraphe.aggregate([
                { $match: { pargrapheMerId } },
                {
                    $group: {
                        _id: "$pargrapheMerId",
                        totalPrevision: { $sum: "$prevision" },
                        totalEmission: { $sum: "$emission" }
                    }
                }
            ]);

            if (result.length === 0) {
                return {
                    totalPrevision: 0,
                    totalEmission: 0
                };
            }

            return result[0];
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des prévisions et émissions: ${error.message}`);
        }
    }
}

module.exports = ParagrapheService;
