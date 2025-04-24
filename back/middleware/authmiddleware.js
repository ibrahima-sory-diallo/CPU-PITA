const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Assure-toi que le chemin est correct

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;  // Utiliser req.cookies et non res.cookies
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('jwt', '', { maxAge: 1 });  // Supprimer le cookie avec une expiration immédiate
                next();  // Ne pas oublier de mettre next()
            } else {
                console.log('Decoded Token:', decodedToken);
                // Utilisation correcte du modèle User
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;  // Assigner l'utilisateur décodé à res.locals
                console.log(res.locals.user);  // Afficher l'utilisateur pour debug
                next();  // Ne pas oublier de mettre next()
            }
        });
    } else {
        res.locals.user = null;  // Aucun utilisateur si pas de token
        next();  // Passer à la suite de la chaîne de middlewares
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;  // Utiliser req.cookies et non res.cookies
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.status(403).json({ message: 'Token invalid or expired' });  // Retourner une réponse si l'authentification échoue
            } else {
                console.log('Decoded Token ID:', decodedToken.id);
                next();  // Passer au prochain middleware ou route si tout est OK
            }
        });
    } else {
        console.log('No token');
        res.status(401).json({ message: 'No token provided' });  // Retourner une réponse si le token est absent
    }
};