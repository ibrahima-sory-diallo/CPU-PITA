import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import Cookies from "js-cookie";
// Définition de la fonction pour supprimer un cookie
const removeCookie = (key: string) => {
  if (typeof window !== "undefined") {
    Cookies.remove(key); // Supprimer le cookie 'jwt'
  }
};

const Logout = () => {
  const navigate = useNavigate();

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Faire une requête GET à l'API pour déconnecter l'utilisateur
      await axios({
        method: "get",
        url: `${import.meta.env.VITE_API_URL}/api/user/logout`,
        withCredentials: true,
      });

      removeCookie("jwt"); // Supprimer le cookie 'jwt'

      // Rediriger l'utilisateur vers /login puis recharger la page
      navigate("/login");
      setTimeout(() => {
        window.location.reload();
      }, 100); // Petite pause pour éviter des conflits avec la navigation
    } catch (err) {
      console.error("Erreur de déconnexion", err);
    }
  };

  return (
    <div
      className="bg-green-700 rounded-sm p-2 cursor-pointer"
      onClick={logout}
    >
      <FaSignOutAlt className="text-white" />
    </div>
  );
};

export default Logout;
