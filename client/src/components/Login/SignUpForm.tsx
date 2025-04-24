import { useState } from "react";
import { Mail, Lock, User } from "react-feather"; // Import des icônes
import axios from 'axios'; // Assure-toi d'avoir axios installé
import { FormEvent, ChangeEvent } from "react"; // Import des types d'événements React

const SignUpForm = () => {
  // Initialisation des états des champs de formulaire
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');
  const [role, setRole] = useState('utilisateur');

  // Initialisation des états des erreurs
  const [pseudoError, setPseudoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [controlPasswordError, setControlPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  // État de l'envoi du formulaire
  const [loading, setLoading] = useState(false);

  // Typage de l'événement pour handleRegister
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    // Réinitialisation des erreurs
    setPseudoError('');
    setEmailError('');
    setPasswordError('');
    setControlPasswordError('');
    setRoleError('');

    let isValid = true;

    // Validation des champs avant envoi
    if (!pseudo) {
      setPseudoError('Le pseudo est requis');
      isValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email invalide');
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      isValid = false;
    }
    if (password !== controlPassword) {
      setControlPasswordError('Les mots de passe ne correspondent pas');
      isValid = false;
    }

    if (!isValid) {
      return; // Empêche l'envoi si des erreurs sont présentes
    }

    // Si tout est valide, on envoie la requête à l'API
    setLoading(true); // Début de l'envoi

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}api/user/register`, // Assure-toi que l'URL est correcte
      withCredentials: true,
      data: { pseudo, email, password, role },
    })
      .then((res) => {
        setLoading(false); // Fin de l'envoi
        if (res.data.errors) {
          // Si des erreurs sont renvoyées par l'API, on les affiche
          setPseudoError(res.data.errors.pseudo);
          setEmailError(res.data.errors.email);
          setPasswordError(res.data.errors.password);
          setRoleError('Erreur sur le role');
        } else {
          // Réinitialisation des champs après succès
          setPseudo('');
          setEmail('');
          setPassword('');
          setControlPassword('');
          setRole('utilisateur');
          console.log('Utilisateur créé avec succès');
        }
      })
      .catch((err) => {
        setLoading(false); // Fin de l'envoi en cas d'erreur
        console.log('Erreur de requête:', err);
      });
  };

  // Typage des événements sur les champs de saisie
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pseudo') setPseudo(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'controlPassword') setControlPassword(value);
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  return (
    <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-gray-200 h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Bienvenue!</h2>
      <form onSubmit={handleRegister} className="text-center w-full">
        
        {/* Champ Username avec Icône */}
        <div className="mb-4 relative w-full flex items-center">
          <User className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="  Entrer votre pseudo"
            id="pseudo"
            name="pseudo"
            value={pseudo}
            onChange={handleChange}
            className="w-full pl-12 pr-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />
          {pseudoError && <div className="text-red-500 text-sm">{pseudoError}</div>}
        </div>

        {/* Champ Email avec Icône */}
        <div className="mb-4 relative w-full flex items-center">
          <Mail className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="email" 
            placeholder="  E-mail" 
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />
          {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
        </div>

        {/* Champ Mot de passe avec Icône */}
        <div className="mb-4 relative w-full flex items-center">
          <Lock className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="password" 
            placeholder="  Mot de passe"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />
          {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
        </div>

        {/* Champ Confirm Password avec Icône */}
        <div className="mb-4 relative w-full flex items-center">
          <Lock className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="password" 
            id="controlPassword"
            name="controlPassword"
            value={controlPassword}
            onChange={handleChange}
            placeholder="Confirmer le mot de passe" 
            className="w-full pl-12 pr-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />
          {controlPasswordError && <div className="text-red-500 text-sm">{controlPasswordError}</div>}
        </div>

        {/* Sélection du rôle */}
        <div className="mb-4 relative w-full flex items-center">
          <select 
            id="role"
            name="role"
            value={role}
            onChange={handleRoleChange}
            className="w-full pl-4 pr-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
          {roleError && <div className="text-red-500 text-sm">{roleError}</div>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-700 text-white py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
