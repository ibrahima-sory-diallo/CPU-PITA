const UserModal = require('../models/userModel.js');
const { signUpErrors, signInErrors } = require('../utils/errors.utils.js');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60 * 1000;  // Durée de validité du token (3 jours en millisecondes)

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
}

module.exports.signUp = async (req, res) => {
    console.log("Données reçues :", req.body); // Debugging ici
    const {   pseudo, email, password, role } = req.body;
    try {
        const user = await UserModal.create({ 
            pseudo, 
            email,   
            password, 
            role: role || 'utilisateur' 
        });

        const token = createToken(user._id, user.role);
        res.cookie('jwt', token, { httpOnly: true, maxAge,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production', // ← important pour Render
        });

        res.status(201).json({ user: user._id, role: user.role });
    
    } catch (err) {
        console.log("Erreur lors de l'inscription :", err); // 🔍 Voir l'erreur exacte
        const errors = signUpErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModal.login(email, password); 
        
        const token = createToken(user.id, user.role);
        res.cookie('jwt', token, { httpOnly: true, maxAge,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production', // ← important pour Render
         });

        res.status(200).json({ message: "Utilsateur connecté"});
    } catch (err) {
        console.log("Erreur lors de la connexion :", err); // 🔍 Voir l'erreur exacte
        const errors = signInErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true, // Important : requis pour les cookies cross-domain en HTTPS
    sameSite: "None", // Autorise les cookies entre Render (API) et Vercel (front)
    expires: new Date(0), // Expire immédiatement
  });

  res.status(200).json({ message: "Déconnexion réussie" });
};

