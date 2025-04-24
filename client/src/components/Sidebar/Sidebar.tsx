import { LuLayoutDashboard } from "react-icons/lu";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import { menuItems } from "../../Constants/Index";
import MenuItem from "./MenuItem";
import { NavLink } from "react-router-dom";

// Définir les types des props du composant Sidebar
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSelectedItem: (item: string) => void;
}

function Sidebar({ isOpen, toggleSidebar, setSelectedItem }: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-800 text-white transition-all z-50 flex flex-col duration-300 dark:bg-slate-700 ${isOpen ? 'w-44' : 'w-16 items-center'}`}
    >
      <div className="flex justify-center items-center py-4">
        <LuLayoutDashboard
          className={`text-2xl text-teal-700 transition-all w-12 ${isOpen ? "w-12" : "w-8"}`}
        />
      </div>

      <div className="mt-6 flex-1">
        {menuItems.map((item) => (
          <NavLink
            to={`/${item.name}`}
            key={item.name}
            className="block"
            onClick={() => setSelectedItem(item.name)}
          >
            <MenuItem
              icon={item.icon}
              name={item.name}
              isOpen={isOpen}
              isLogout={item.isLogout}
            />
          </NavLink>
        ))}
      </div>

      <button
        onClick={toggleSidebar}
        className="m-2 flex items-center justify-center rounded-md bg-gray-700 p-3 text-2xl font-bold hover:bg-teal-500 duration-300"
      >
        {isOpen ? <RiArrowLeftWideFill /> : <RiArrowRightWideFill />}
      </button>
    </div>
  );
}

export default Sidebar;
