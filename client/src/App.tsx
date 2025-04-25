import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getUser } from "./components/Action/user.action";
import { UidContent } from "./components/AppContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Dashboard from "./pages/Dashboard";
import Recette from "./pages/Recette";
import Depense from "./pages/Depense";
import Operation from "./pages/Operation";
import Analytics from "./pages/Analytics";
import Archives from "./pages/Archives";
import { AuthProvider } from "./components/AuthContext";
import Files from "./Firebase/archives/FIles";

// Assure-toi d'importer le bon type AppDispatch pour `dispatch`
import { AppDispatch } from './Store/Store'; // Chemin d'importation correct pour AppDispatch

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>(); // Typage correct de dispatch
  const location = useLocation();

  // Persist dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("darkMode", JSON.stringify(true));
    } else {
      localStorage.setItem("darkMode", JSON.stringify(false));
    }
  }, [darkMode]);

  // Token retrieval and authentication
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jwtid`, {
          withCredentials: true,
        });
        setUid(res.data);
        dispatch(getUser(res.data));  // dispatch user info to store
      } catch (err) {
        console.error("Token fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-bold">
        Chargement...
      </div>
    );
  }

  // Redirect logic: If no uid and not at /Profil, redirect to Profil
  if (!uid && location.pathname !== "/Profil") {
    return <Navigate to="/Profil" />;
  }

  // Redirect to home if the user is logged in and trying to access /Profil
  if (uid && location.pathname === "/Profil") {
    return <Navigate to="/" />;
  }

  return (
    <UidContent.Provider value={uid}>
      {uid ? (
        <div className={`flex font-Montserrat bg-slate-700 ${darkMode && "dark"}`}>
          <Sidebar
            isOpen={isOpen}
            toggleSidebar={() => setIsOpen(!isOpen)}
            setSelectedItem={setSelectedItem}
          />

          <div
            className={`flex-1 bg-slate-200 ${isOpen ? "md:ml-44" : "ml-16"} transition-all duration-300 dark:bg-slate-800`}
          >
            <div className="mb-16">
              <Header
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
                selectedItem={selectedItem}
              />
            </div>

            {/* Routes with protected content */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Analytics" element={<Analytics />} />
              <Route path="/Recette" element={<Recette selectedItem={selectedItem} />} />
              <Route path="/Depense" element={<Depense selectedItem={selectedItem} />} />
              <Route path="/Operation" element={<Operation />} />

              {/* Protected routes */}
              <Route
                path="/Archives"
                element={
                  <AuthProvider>
                    <Archives />
                  </AuthProvider>
                }
              />
              <Route
                path="/files/:fileId"
                element={
                  <AuthProvider>
                    <Files />
                  </AuthProvider>
                }
              />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/Profil" element={<Profil />} />
        </Routes>
      )}
    </UidContent.Provider>
  );
}

export default App;
