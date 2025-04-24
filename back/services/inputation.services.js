const Inputation = require('../models/inputationModel');
const Paragraphe = require('../models/paragrapheModel');
const mongoose = require('mongoose');

class InputationService {
    // Fonction pour vérifier si le paragraphe existe
    static async verifyParagrapheExistence(paragrapheId) {
        const paragraphe = await Paragraphe.findById(paragrapheId);
        if (!paragraphe) {
            throw new Error("Paragraphe non trouvé.");
        }
        return paragraphe;
    }

    // Fonction pour créer une imputation
    static async createInputation(paragrapheId, inputationData) {
        try {
            // Vérification que le paragraphe existe
            const paragraphe = await this.verifyParagrapheExistence(paragrapheId);

            // Créer une nouvelle imputation
            const inputation = new Inputation({
                ...inputationData,
                paragrapheId, // Associer l'ID du paragraphe
            });

            // Sauvegarder l'imputation
            await inputation.save();

            // Ajouter l'ID de l'imputation au paragraphe
            paragraphe.inputations.push(inputation._id);
            await paragraphe.save();

            return inputation;
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'imputation: ' + error.message);
        }
    }

    // Fonction pour récupérer les imputations associées à un paragraphe
    static async getInputationsByParagraphe(paragrapheId) {
        try {
            // Recherche des imputations associées au paragraphe
            const inputations = await Inputation.find({ paragrapheId });

            if (!inputations || inputations.length === 0) {
                throw new Error("Aucune imputations trouvée.");
            }

            return inputations;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des imputations: ${error.message}`);
        }
    }

    static async updateInputation(inputationId, updateData) {
        try {
          console.log("Updating inputation:", inputationId, updateData); // debug
      
          const inputation = await Inputation.findById(inputationId);
          if (!inputation) {
            throw new Error("Imputation non trouvée.");
          }
      
          Object.assign(inputation, updateData);
          await inputation.save();
      
          return inputation;
        } catch (error) {
          console.error("Erreur updateInputation :", error); // debug
          throw new Error(`Erreur lors de la modification de l'imputation: ${error.message}`);
        }
      }
      

      static async deleteInputation(inputationId) {
        try {
          console.log("Suppression en cours pour :", inputationId);
      
          const inputation = await Inputation.findById(inputationId);
          if (!inputation) {
            throw new Error("Imputation non trouvée.");
          }
      
          // Supprimer l'imputation
          await Inputation.findByIdAndDelete(inputationId); // ✅ corrigé ici
      
          // Mettre à jour le paragraphe associé
          const paragraphe = await Paragraphe.findById(inputation.paragrapheId);
          if (paragraphe) {
            paragraphe.inputations.pull(inputationId);
            await paragraphe.save();
          }
      
          return { message: 'Imputation supprimée avec succès.' };
        } catch (error) {
          console.error("Erreur deleteInputation :", error);
          throw new Error(`Erreur lors de la suppression de l'imputation: ${error.message}`);
        }
      }
      
      
}

module.exports = InputationService;
