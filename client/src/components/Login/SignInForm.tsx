import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SignInForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // État de chargement
  const navigate = useNavigate();

  useEffect(() => {
    // Réinitialisation des champs au premier rendu
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  }, []);

  // Type de l'événement de soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Réinitialiser les erreurs avant de soumettre
    setEmailError("");
    setPasswordError("");

    // Indicateur de chargement activé
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.errors) {
        setEmailError(response.data.errors.email || "");
        setPasswordError(response.data.errors.password || "");
      } else {
        // Succès : Redirection et réinitialisation des champs
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 100); // Petite pause pour éviter des conflits avec la navigation
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    } finally {
      // Désactivation de l'indicateur de chargement après la fin de la requête
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Formulaire de connexion */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden transform scale-95 transition-all duration-500 hover:scale-100">
        {/* Section Formulaire */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center bg-gray-200 h-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Bienvenue !</h2>
          <form onSubmit={handleSubmit} className="text-center w-full">
            {/* Champ Email */}
            <div className="mb-4 relative w-full">
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                id="email"
                value={email}
                className="w-full pl-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
            </div>

            {/* Champ Mot de passe */}
            <div className="mb-4 relative w-full">
              <input
                type="password"
                placeholder="Mot de passe"
                name="password"
                id="password"
                value={password}
                className="w-full pl-4 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            </div>

            <div className="flex justify-between items-center mb-6 text-sm w-full">
              <a href="#" className="block text-left text-green-600 hover:underline">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
            >
              {isLoading ? (
                // Spinner de chargement quand isLoading est vrai
                <div className="animate-spin border-4 border-t-4 border-green-800 border-solid rounded-full h-6 w-6 mx-auto"></div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Section Droite - Message */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-green-400 to-green-500 text-white flex flex-col justify-center items-center p-10 h-full">
          <h2 className="text-2xl font-bold mb-4">Bienvenue !</h2>
          <p className="text-center text-sm">
            Bienvenue sur la plateforme de comptabilité de la CU.PITA - votre outil indispensable pour une gestion financière optimale et transparente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
