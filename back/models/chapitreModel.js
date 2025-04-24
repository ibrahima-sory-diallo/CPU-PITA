const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapitreSchema = new Schema({
  numero: {
    type: Number,
    required: true,
  },
  nom: {
    type: String,
    required: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
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
    default: 0
  },
  encours: {
    type: Number,
    default: 0
  },
  annee: { 
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  mois: {
    type: String,
    default: new Date().toLocaleString('fr-FR', { month: 'long' })
  },
  statut: {
    type: String,
    enum: ["active", "clôturé"],
    default: "active",
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  }
}, {
  timestamps: true,
});

// Middleware pre-save pour affecter la valeur de taux et encours avant d'enregistrer le chapitre
chapitreSchema.pre('save', function (next) {
  // Si realisation et prevision sont définis, on calcule le taux
  if (this.realisation !== undefined && this.prevision !== undefined) {
    this.taux = ((this.realisation / this.prevision)*100);
  }

  // Calcul de encours basé sur prevision
  if (this.prevision !== undefined) {
    this.encours = this.prevision + (this.prevision / 100); // Ajuster le calcul si nécessaire
  }

  next();
});

// Crée le modèle Chapitre
const Chapitre = mongoose.model('Chapitre', chapitreSchema);

module.exports = Chapitre;
