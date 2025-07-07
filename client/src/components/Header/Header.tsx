import { useContext,  } from "react";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { UidContent } from "../AppContext";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import SignInForm from "../Login/SignInForm";
import Logout from "../Login/Logout";
// Typage des props pour le composant Header
interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedItem: string;
}

interface UserState {
  pseudo?: string;
}

function Header({ darkMode, toggleDarkMode, selectedItem }: HeaderProps) {
  // Récupère l'UID de l'utilisateur à partir du contexte
  const uid = useContext(UidContent);
  
  // Récupère les données de l'utilisateur depuis le store Redux (en supposant que l'état du store a la forme suivante)
  const useData = useSelector((state: { user: UserState }) => state.user);
  
  return (
    <div className="fixed w-full  z-50 flex items-center justify-between bg-white px-7 py-3 dark:bg-slate-700 dark:text-gray-300">
      <h1 className="font-bold">{selectedItem}</h1>
      <div className=" mr-44 flex items-center gap-3">
        <button
          className="rounded-md dark:bg-slate-600 dark:text-slate-300 bg-slate-200"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <FaSun className="p-2 text-4xl" />
          ) : (
            <FaMoon className="p-2 text-4xl" />
          )}
        </button>
        <div className="flex items-center gap-3">
          {uid ? (
            <>
              <FaUser className="rounded-md bg-slate-200 p-2 text-4xl dark:bg-slate-600 dark:text-slate-300" />
              {useData && useData.pseudo ? (
                <NavLink to="/Profil">
                  <h1 className="font-medium">{useData.pseudo}</h1>
                </NavLink>
              ) : (
                <p>Chargement...</p>
              )}
              <h2>
                <Logout />
              </h2>
            </>
          ) : (
            <NavLink to="/Profil">
              <SignInForm />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
