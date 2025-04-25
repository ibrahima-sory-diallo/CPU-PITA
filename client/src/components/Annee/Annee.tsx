import React, { useState, useEffect } from 'react';
import AjoutSectionModal from './AjoutSectionModal';

const ComptableApp: React.FC = () => {
  const [annee, setAnnee] = useState('');
  const [anneeCloture, setAnneeCloture] = useState('');
  const [nomSection, setNomSection] = useState('');
  const [titreSection, setTitreSection] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState<string | null>(null);
  const [selectedComptableId, setSelectedComptableId] = useState<string | null>(null); // Ajout de l'état pour l'ID
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sections, setSections] = useState<any[]>([]); // Sections à afficher
  const [annees, setAnnees] = useState<any[]>([]); // Années comptables disponibles
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isValidYear = (year: string) => {
    const y = Number(year);
    return !isNaN(y) && y >= 1000 && y <= 9999;
  };

  const apiRequest = async (url: string, method = 'GET', body?: any) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (response.ok) return data;
      throw new Error(data.message || 'Erreur serveur.');
    } catch {
      throw new Error("Erreur de connexion à l'API.");
    }
  };

  const createAnnee = async () => {
    if (!isValidYear(annee)) return setError('Année invalide');
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/comptable/creerAnnee/${annee}`, 'POST');
      setMessage(data.message);
      setError('');
      fetchAnnees();
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  const cloturerAnnee = async () => {
    if (!isValidYear(anneeCloture)) return setError('Année de clôture invalide');
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/comptable/cloturer/${anneeCloture}`, 'POST');
      setMessage(data.message);
      setError('');
      fetchAnnees();
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  const ajouterSection = async () => {
    if (!nomSection.trim() || !titreSection.trim() || !selectedComptableId) {
      setError('Nom, titre ou identifiant comptable manquant');
      return;
    }
    try {
      const body = { name: nomSection, titre: titreSection };
      const url = `${import.meta.env.VITE_API_URL}/api/section/creerSection/${selectedComptableId}`;
      const data = await apiRequest(url, 'POST', body);
  
      setMessage(data.message);
      setError('');
      setNomSection('');
      setTitreSection('');
      setIsModalOpen(false);
      fetchDonnees(); // Rechargement des sections après ajout
      fetchAnnees(); // Rechargement des années après ajout
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  const fetchDonnees = async () => {
    if (!isValidYear(annee)) return setError('Année invalide');
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/comptable/donnees/${annee}`);
      setSections(data); // Mise à jour des sections avec les données récupérées
      setMessage('');
      setError('');
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  const fetchAnnees = async () => {
    try {
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/api/comptable/tousAnnee`);
      setAnnees(data); // Mise à jour des années comptables disponibles
      setMessage('');
      setError('');
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  useEffect(() => {
    fetchAnnees(); // Chargement des années comptables au premier rendu
  }, []);

  useEffect(() => {
    if (selectedAnnee) {
      fetchDonnees(); // Récupération des sections lors de la sélection d'une année
    }
  }, [selectedAnnee]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">Gestion des Années Comptables</h1>

      <div className="flex justify-between items-start m-2 mb-6 bg-gray-100 p-4 rounded-lg">
        <div className="w-full max-w-xs bg-white p-3 rounded-md">
          <h2 className="text-xl font-medium mb-2 text-gray-800">Créer une année comptable</h2>
          <input
            type="text"
            placeholder="Entrez l'année"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
          <button
            onClick={createAnnee}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Créer
          </button>
        </div>

        <div className="w-full max-w-xs bg-white rounded-md p-3">
          <h2 className="text-xl font-medium mb-2 text-gray-800">Clôturer une année comptable</h2>
          <input
            type="text"
            placeholder="Entrez l'année à clôturer"
            value={anneeCloture}
            onChange={(e) => setAnneeCloture(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
          <button
            onClick={cloturerAnnee}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
          >
            Clôturer
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4 text-gray-800">Années Comptables</h2>
        {annees.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Année</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {annees.map((a, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{a.annee}</td>
                  <td className="px-4 py-2">
                    {a.cloture ? (
                      <span className="text-green-500 font-semibold">Clôturée</span>
                    ) : (
                      <span className="text-yellow-500 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex space-x-4">
                    <button
                      onClick={() => {
                        setSelectedAnnee(a.annee);
                        setSelectedComptableId(a._id); // Met à jour l'ID du comptable
                        setIsModalOpen(true); // Ouvre le modal
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Créer Section
                    </button>
                    <button
                      onClick={() => setSelectedAnnee(a.annee)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune année comptable disponible.</p>
        )}
      </div>

      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {isModalOpen && (
        <AjoutSectionModal
          nomSection={nomSection}
          titreSection={titreSection}
          setNomSection={setNomSection}
          setTitreSection={setTitreSection}
          ajouterSection={ajouterSection}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Affichage des sections de l'année sélectionnée */}
      {selectedAnnee && sections.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-medium mb-4 text-gray-800">Sections pour l'année {selectedAnnee}</h2>
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Nom de la section</th>
                <th className="px-4 py-2 text-left">Titre de la section</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{section.name}</td>
                  <td className="px-4 py-2">{section.titre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComptableApp;
