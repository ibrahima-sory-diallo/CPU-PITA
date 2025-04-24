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

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}jwtid`, {
          withCredentials: true,
        });
        setUid(res.data);
        dispatch(getUser(res.data));
      } catch (err) {
        console.log("No token");
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

  if (!uid && location.pathname !== "/Profil") {
    return <Navigate to="/Profil" />;
  }

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

          <div className={`flex-1 bg-slate-200 ${isOpen ? "md:ml-44" : "ml-16"} transition-all duration-300 dark:bg-slate-800`}>
            <div className="mb-16">
              <Header
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
                selectedItem={selectedItem}
              />
            </div>

            {/* Toutes les routes ici */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Analytics" element={<Analytics />} />
              <Route path="/Recette" element={<Recette selectedItem={selectedItem} />} />
              <Route path="/Depense" element={<Depense selectedItem={selectedItem} />} />
              <Route path="/Operation" element={<Operation />} />

              {/* ✅ Archives et Files protégés par AuthProvider */}
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
