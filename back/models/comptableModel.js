const mongoose = require('mongoose');
const Schema = mongoose.Schema; // ✅ Importation de Schema

const ComptableSchema = new Schema({
  annee: { 
    type: Number, 
    unique: true, 
    required: true, 
    default: () => new Date().getFullYear() // 📌 Année en cours automatiquement
  },
  cloture: { 
    type: Boolean, 
    default: false 
  },
  dateCloture: { 
    type: Date, 
    default: null 
  },
  sections: [
    {
      type: Schema.Types.ObjectId,  // Référence aux objets de la collection "Section"
      ref: 'Section' // Correctement utiliser "Section" (assure-toi que le modèle "Section" existe)
    }
  ]
});

// Crée le modèle Comptable avec le schema
const Comptable = mongoose.model('Comptable', ComptableSchema);

// Exporter le modèle Comptable pour l'utiliser ailleurs dans l'application
module.exports = Comptable;
