const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Inputation = require('./inputationModel');
const Article = require('./articleModel');
const Chapitre = require('./chapitreModel');
const ParagrapheMer = require('./paragrapheMerModel');

const paragrapheSchema = new Schema({
    numero: {
        type: Number,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    inputations: [{
        type: Schema.Types.ObjectId,
        ref: 'Inputation'
    }],
    prevision: {
        type: Number,
    },
    realisation: {
        type: Number,
        default: 0
    },
    taux: {
        type: Number,
    },
    encours: {
        type: Number,
    },
    annee: { 
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    }, 
    statut: {
        type: String,
        enum: ["active", "clôturé"],
        default: "active",
    },
    paragrapheMerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'ParagrapheMer'
    }
},
{
    timestamps: true
});

// Middleware pre-save pour mettre à jour "realisation", "taux" et "encours"
paragrapheSchema.pre('save', async function(next) {
    try {
        // Vérifier si le paragraphe a des imputations
        if (this.inputations.length > 0) {
            const totalMontant = await Inputation.aggregate([
                { $match: { _id: { $in: this.inputations } } },
                { $group: { _id: null, totalMontant: { $sum: "$montant" } } }
            ]);

            // Mettre à jour la realisation avec le totalMontant trouvé
            this.realisation = totalMontant.length > 0 ? totalMontant[0].totalMontant : 0;
        } else {
            this.realisation = 0;
        }

        // Calcul du taux si les deux valeurs existent
        if (this.realisation !== undefined && this.prevision !== undefined && this.prevision !== 0) {
            this.taux = (this.realisation / this.prevision) * 100;
        }

        // Calcul de encours basé sur prevision
        if (this.prevision !== undefined) {
            this.encours = this.prevision + (this.prevision / 100); // Ajuster le calcul si nécessaire
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware post-save pour mettre à jour la realisation du chapitre
paragrapheSchema.post('save', async function(doc, next) {
    try {
        const paragrapheMer = await ParagrapheMer.findById(doc.paragrapheMerId);
        if (!paragrapheMer) throw new Error('ParagrapheMer non trouvé');

        const article = await Article.findById(paragrapheMer.articleId);
        if (!article) throw new Error('Article non trouvé');

        const paragraphesMers = await ParagrapheMer.find({ _id: { $in: article.paragraphesMers } }).populate({
            path: 'paragraphes',
            select: 'realisation'
        });

        let totalRealisation = 0;
        for (const mer of paragraphesMers) {
            for (const p of mer.paragraphes) {
                totalRealisation += p.realisation || 0;
            }
        }

        const chapitre = await Chapitre.findById(article.chapitreId);
        if (!chapitre) throw new Error('Chapitre non trouvé');

        chapitre.realisation = totalRealisation;
        await chapitre.save();

        next();
    } catch (error) {
        console.error('Erreur post-save paragraphe:', error);
        next(error);
    }
});

const Paragraphe = mongoose.model('Paragraphe', paragrapheSchema);

module.exports = Paragraphe;
