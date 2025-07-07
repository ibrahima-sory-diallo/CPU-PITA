import {
  FaChartLine,
  FaSignOutAlt,
  FaWallet,
  FaMoneyBillWave,
  FaCog,
  FaFolderOpen,
  FaPlus,
  FaList,
  FaEnvelope,
  FaCalendarAlt,
  FaSitemap
} from "react-icons/fa";

import { LuLayoutDashboard } from "react-icons/lu";

// Menu items
export const menuItems = [
  {
    name: "Dashboard",
    icon: LuLayoutDashboard,
    isLogout: false,
  },
  {
    icon: FaWallet,
    name: "Recette",
  },
  {
    icon: FaMoneyBillWave,
    name: "Depense",
  },
  {
    icon: FaCog,
    name: "Parametre",
    children: [ // uniformisé en 'children'
      {
        icon: FaCalendarAlt,
        name: "Gestion Année",
      },
      { 
        icon:FaSitemap,
        name: "Ajouter section",
      },
    ],
  },
  {
    icon: FaSignOutAlt,
    name: "Logout",
    isLogout: true,
  },
  {
    icon: FaChartLine,
    name: "Operation",
  },
  {
    icon: FaFolderOpen,
    name: "Archives",
    children: [ // uniformisé en 'children'
      {
        icon: FaPlus,
        name: "Ajouter",
      },
      {
        icon: FaList,
        name: "Listes",
      },
    ],
  },
  // {
  //   icon: FaEnvelope,
  //   name: "Email",
  // },
  {
    icon: FaChartLine,
    name: "Transaction financiere",
  },
    {
    icon: FaFolderOpen,
    name: "Utilisateurs",
  },
];

export const ChartData01 = [
  {
    name: "Electronics",
    value: 400,
  },
  {
    name: "Clothing",  // corrigé typo
    value: 300,
  },
  {
    name: "Groceries",
    value: 300,
  },
  {
    name: "Furniture",
    value: 200,
  },
];

export const ChartData02 = [
  {
    name: "Laptops",
    value: 400,
  },
  {
    name: "Smartphones",
    value: 300,
  },
  {
    name: "Groceries",
    value: 300,
  },
  {
    name: "Furniture",
    value: 200,
  },
];
