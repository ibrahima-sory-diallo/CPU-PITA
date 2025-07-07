const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    titre: {
      type: String,
      required: true,
    },
    statut: {
      type: String,
      enum: ["ouvert", "fermé"],
      default: "ouvert",
    },
    dateCloture: {
      type: Date,
      default: null, // Null tant que la section n'est pas clôturée
    },
    ancienneSection: {
      type: Schema.Types.ObjectId,
      ref: "Section", // Référence vers l'ancienne section clôturée
      default: null,
    },
    ComptableId: {
      type: Schema.Types.ObjectId, 
      ref: 'Comptable', // Référence au modèle Comptable
      required: true, // Lier cette section à une année comptable spécifique
    },
    annee: {
      type: Number,  // Type Number pour se lier à l'année du modèle Comptable
      required: true,
      default: () => new Date().getFullYear() 
    },
    chapitres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chapitre", // Référence aux chapitres de cette section
      },
    ],
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
