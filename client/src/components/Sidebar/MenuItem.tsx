import { FC } from "react";

// Définir les types des props du composant MenuItem
interface MenuItemProps {
  icon: React.ComponentType; // L'icône est un composant React (ex: FaHome, RiArrowRightWideFill, etc.)
  name: string;              // Le nom de l'élément du menu
  isOpen: boolean;           // Indique si la barre latérale est ouverte ou non
  isLogout?: boolean;        // Facultatif, si c'est un bouton de déconnexion
}

const MenuItem: FC<MenuItemProps> = ({ icon: Icon, name, isOpen, isLogout }) => {
  return (
    <div
      className={`m-2 flex cursor-pointer items-center space-x-4 rounded-md px-4 py-3 text-gray-400 duration-500 hover:bg-teal-700 hover:text-white${isLogout ? " mt-auto hidden" : ""}`}
    >
      <Icon />
      {isOpen && <span className="text-[14px] overflow-hidden">{name}</span>}
    </div>
  );
};

export default MenuItem;
