import { useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { menuItems } from "../../Constants/Index";
import MenuItem from "./MenuItem";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSelectedItem: (item: string) => void;
}

function Sidebar({ isOpen, toggleSidebar, setSelectedItem }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-800 text-white transition-all z-50 flex flex-col duration-300 dark:bg-slate-700 ${isOpen ? 'w-48' : 'w-16 items-center'}`}
    >
      <div className="flex justify-center items-center py-4">
        <LuLayoutDashboard className={`text-2xl text-teal-700 transition-all`} />
      </div>

      <div className="mt-6 flex-1 w-full">
        {menuItems.map((item) => (
          <div key={item.name} className="w-full">
            {item.children ? (
              <>
                <div
                  className="flex items-center justify-between pr-4 cursor-pointer hover:bg-teal-700 rounded-md"
                  onClick={() => toggleMenu(item.name)}
                >
                  <MenuItem
                    icon={item.icon}
                    name={item.name}
                    isOpen={isOpen}
                    isLogout={item.isLogout}
                  />
                  {isOpen && (
                    <span className="text-xs">
                      {openMenus[item.name] ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </div>
                <div
                  className={`ml-6 overflow-hidden transition-all duration-300 ${
                    openMenus[item.name] && isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      to={`/${child.name}`}
                      key={child.name}
                      onClick={() => setSelectedItem(child.name)}
                      className="block text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded px-3 py-2 my-1 transition"
                    >
                      <div className="flex items-center gap-2">
                        <child.icon className="text-xs" />
                        <span>{child.name}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink
                to={`/${item.name}`}
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
            )}
          </div>
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
