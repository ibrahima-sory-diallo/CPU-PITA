const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Inputation = require('./inputationModel');
const Article = require('./articleModel'); // Assurez-vous d'importer votre modèle d'article
const Chapitre = require('./chapitreModel');  // Assurez-vous que le modèle du chapitre est bien importé

const paragrapheMerSchema = new Schema({
    numero: {
        type: Number,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    paragraphes: [{
        type: Schema.Types.ObjectId,
        ref: 'Paragraphe'
    }],
    prevision: {
        type: Number,
        default:0
    },
    realisation: {
        type: Number,
        default: 0
    },
    taux: {
        type: Number,  // Ajoutez ici le type du recouvrement
    },
    annee: { 
        type: Number,
         required: true,
         default: () => new Date().getFullYear() // 📌 Année en cours automatiquement // 📌 Année en cours automatiquement
 
    }, 
    statut: {
        type: String,
        enum: ["ouvert", "fermé"], // Le statut "clôturé" ici
        default: "ouvert",
      },
    articleId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Article' // Corrigé: référence à "Article"
    }
},
{
    timestamps: true
});



const ParagrapheMer = mongoose.model('ParagrapheMer', paragrapheMerSchema);

module.exports = ParagrapheMer;
