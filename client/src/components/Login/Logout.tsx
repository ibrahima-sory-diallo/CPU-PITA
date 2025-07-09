import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        withCredentials: true,
      });

      // Redirige vers la page de connexion
      navigate("/Profil"); // ← Assure-toi que cette route existe bien
      window.location.reload(); // Force le rechargement pour effacer les états
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
