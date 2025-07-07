const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InputationSchema = new Schema({
    numero: { type: Number, required: true },
    date: { type: String, required: true },
    mdt: { type: String, required: true },
    beneficiaire: { type: String, required: true },
    montant: { type: Number, required: true },
    montantCumulle: { type: Number, default: 0 },
    observation: { type: Number, default: 0 },
    mois: {
        type: String,
        default: new Date().toLocaleString('fr-FR', { month: 'long' })
      },
    annee: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    statut: {
        type: String,
        enum: ["ouvert", "fermé"],
        default: "ouvert"
    },
    paragrapheId: {
        type: Schema.Types.ObjectId,
        ref: 'paragraphe',
        required: true
    }
}, {
    timestamps: true
});


// 🔁 Fonction pour recalculer les montants cumulés d’un paragraphe
async function recalculateMontants(paragrapheId) {
    const imputations = await Inputation.find({ paragrapheId }).sort({ createdAt: 1 });
    
    let cumul = 0;
    for (const imputation of imputations) {
        cumul += imputation.montant;
        imputation.montantCumulle = cumul;
        
        // ⚠️ Flag spécial pour ne pas déclencher à nouveau le post('save')
        imputation._recalculating = true;
        await imputation.save({ validateBeforeSave: false });
    }
}

// ✅ Avant de sauvegarder : vérifie unicité
InputationSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const exists = await Inputation.findOne({
                numero: this.numero,
                paragrapheId: this.paragrapheId
            });
            
            if (exists) {
                return next(new Error(`Le numéro ${this.numero} existe déjà pour ce paragraphe.`));
            }
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

// ✅ Après sauvegarde → recalculer sauf si on est déjà en recalcul
InputationSchema.post('save', async function () {
    if (this._recalculating) return;
    await recalculateMontants(this.paragrapheId);
});

// ✅ Après suppression → recalcul aussi
InputationSchema.post('remove', async function () {
    await recalculateMontants(this.paragrapheId);
});

const Inputation = mongoose.model('Inputation', InputationSchema);
module.exports = Inputation;
