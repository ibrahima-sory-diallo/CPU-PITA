import { useEffect, useState } from "react";

type AnneeComptable = {
  _id: string;
  annee: number;
  cloture: boolean;
  dateCloture?: string;
};

const ListeAnneesComptables = () => {
  const [annees, setAnnees] = useState<AnneeComptable[]>([]);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAnnee, setSelectedAnnee] = useState<AnneeComptable | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [sectionTitre, setSectionTitre] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const fetchAnnees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comptable/tousAnnee`);
      const data: AnneeComptable[] = await response.json();
      setAnnees(data);
    } catch (err) {
      setError("Impossible de récupérer les années.");
    }
  };

  useEffect(() => {
    fetchAnnees();
  }, []);

  const openModal = (annee: AnneeComptable) => {
    setSelectedAnnee(annee);
    setShowModal(true);
    setSectionName("");
    setSectionTitre("");
    setModalMessage("");
  };

  const handleCreateSection = async () => {
    if (!sectionName || !sectionTitre) {
      setModalMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/section/creerSection/${selectedAnnee?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sectionName, titre: sectionTitre }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de la création.");

      setModalMessage("✅ Section créée avec succès.");
      setTimeout(() => {
        setShowModal(false);
        fetchAnnees(); // Met à jour la liste
      }, 1000);
    } catch (error: any) {
      setModalMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Liste des années comptables</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 text-sm rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Année</th>
              <th className="px-4 py-2 border">Statut</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {annees.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{a.annee}</td>
                <td className="px-4 py-2 border">
                  {a.cloture ? (
                    <span className="text-red-600 font-semibold">Clôturée</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td> 
                <td className="px-4 py-2 border text-center">
                  {!a.cloture && (
                    <button
                      onClick={() => openModal(a)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Créer section
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {annees.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Aucune année disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Créer une section pour {selectedAnnee?.annee}
            </h3>

            <input
              type="text"
              placeholder="Nom (name)"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Titre"
              value={sectionTitre}
              onChange={(e) => setSectionTitre(e.target.value)}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
            />

            {modalMessage && (
              <p
                className={`text-sm font-medium mb-3 ${
                  modalMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {modalMessage}
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSection}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeAnneesComptables;
