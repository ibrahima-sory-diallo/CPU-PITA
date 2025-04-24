import {
    FaChartLine,
    FaSignOutAlt,
    FaWallet,
    FaMoneyBillWave,
    FaCog,
    FaFolderOpen
} from "react-icons/fa";


import { LuLayoutDashboard } from "react-icons/lu";

//Menu iteams
export const menuItems = [
    {
        name: "Dashboard",
        icon: LuLayoutDashboard,
        isLogout: false
    },
    {
        icon:FaWallet,
        name:"Recette"
    },
    {
        icon:FaMoneyBillWave,
        name:"Depense"
    },
   
    {
        icon:FaChartLine,
        name:"Analytics"
    },
    {
        icon:FaSignOutAlt,
        name:"Logout",
        isLogout:true
    },
    {
        icon:FaCog,
        name:"Operation",
    },
    {
        icon:FaFolderOpen,
        name:"Archives"
    }
];

export const ChartData01 = [
    {
        name: 'Electronics',
        value:400
    },
    {
        name: 'Chloting',
        value:300
    },
    {
        name: 'Groceries',
        value:300
    },
    {
        name: 'Furniture',
        value:200
    },
];
export const ChartData02 = [
    {
        name: 'Laptops',
        value:400
    },
    {
        name: 'Smartphones',
        value:300
    },
    {
        name: 'Groceries',
        value:300
    },
    {
        name: 'Furniture',
        value:200
    },
]