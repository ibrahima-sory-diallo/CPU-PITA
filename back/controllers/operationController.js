const Operation = require("../models/operationModel");

// Récupérer toutes les opérations
exports.getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find();
        res.json(operations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Ajouter une nouvelle opération
exports.createOperation = async (req, res) => {
    try {
        const { mois, recettes, depenses, solde } = req.body;
        const newOperation = new Operation({ mois, recettes, depenses, solde });

        await newOperation.save();
        res.status(201).json(newOperation);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", error });
    }
};

// Récupérer une opération par ID
exports.getOperationById = async (req, res) => {
    try {
        const operation = await Operation.findById(req.params.id);
        if (!operation) return res.status(404).json({ message: "Opération non trouvée" });

        res.json(operation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Mettre à jour une opération
exports.updateOperation = async (req, res) => {
    try {
        const updatedOperation = await Operation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedOperation);
    } catch (error) {
        res.status(500).json({ message: "Erreur de mise à jour", error });
    }
};

// Supprimer une opération
exports.deleteOperation = async (req, res) => {
    try {
        await Operation.findByIdAndDelete(req.params.id);
        res.json({ message: "Opération supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur de suppression", error });
    }
};
