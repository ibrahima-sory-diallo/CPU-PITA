module.exports.signUpErrors = (err) => {
    // Initialisation des erreurs
    let errors = { pseudo: '', email: '', password: '' };

    // Vérifier les messages d'erreur de MongoDB concernant les champs spécifiques
    if (err.message.includes('pseudo')) {
        errors.pseudo = "Pseudo incorrect ou déjà pris";
    }
    if (err.message.includes('email')) {
        errors.email = "Email incorrect";
    }
    if (err.message.includes('password')) {
        errors.password = "Le mot de passe doit faire 6 caractères au minimum";
    }

    // Gérer les erreurs liées aux codes d'erreur de MongoDB (ex: code 11000 pour les doublons)
    if (err.code === 11000) {
        const duplicatedField = Object.keys(err.keyValue)[0]; // Récupérer le champ dupliqué
        if (duplicatedField.includes("pseudo")) {
            errors.pseudo = "Ce pseudo est déjà enregistré";
        } else if (duplicatedField.includes("email")) {
            errors.email = "Cet email est déjà enregistré";
        }
    }

    return errors;
}
module.exports.signInErrors = (err) =>{
    let errors = {email: '', password: ''}
    if(err.message.includes("email")){
        errors.email = "Email inconnu"
    }
    if(err.message.includes("password")){
        errors.password = "Le mot de passe ne correspond pas"
    }
    return errors
}
