const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const articleSchema= new Schema({
    numero: {
        type: Number,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    annee: { 
        type: Number,
         required: true,
         default: () => new Date().getFullYear() // 📌 Année en cours automatiquement

    }, 
    statut: {
        type: String,
        enum: ["active", "clôturé"], // Le statut "clôturé" ici
        default: "active",
      },
    paragraphesMers: [{
        type: Schema.Types.ObjectId,
        ref: 'ParagrapheMer'
    }],
    chapitreId: {
        type: Schema.Types.ObjectId,
        ref: 'Chapitre',
        required: true
    }
},
{
    timestamps: true,
})
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;