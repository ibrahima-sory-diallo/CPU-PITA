
const UserModal = require('../models/usermodel')
const ObjectID = require('mongoose').Types.ObjectId;
//afficher tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModal.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).send('Erreur serveur');
    }
};
//afficher un utilisateur
module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID invalide : " + req.params.id);
    }

    try {
        const user = await UserModal.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé avec l'ID : " + req.params.id);
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur :", err);
        res.status(500).send("Erreur serveur");
    }
};
//modifier un utilisateur
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID invalide : " + req.params.id);
    }

    try {
        const updatedUser = await UserModal.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { bio: req.body.bio } },
            { new: true, upsert: true, setDefaultsOnInsert: true } 
        );

        if (!updatedUser) {
            return res.status(404).send("Utilisateur non trouvé avec l'ID : " + req.params.id);
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        res.status(500).json({ message: err.message || 'Erreur serveur' });
    }
};

//supprimer un utlisateur
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID invalide : " + req.params.id);
    }

    try {
        const deletedUser = await UserModal.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).send("Utilisateur non trouvé avec l'ID : " + req.params.id);
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        res.status(500).json({ message: err.message || 'Erreur serveur' });
    }
};