import { useEffect, useState } from "react";

type AnneeComptable = {
  _id: string;
  annee: number;
  cloture: boolean;
  dateCloture?: string;
};

const DuplicationAnnee = () => {
  const [annees, setAnnees] = useState<AnneeComptable[]>([]);
  const [anneeActuelle, setAnneeActuelle] = useState<number | "">("");
  const [nouvelleAnnee, setNouvelleAnnee] = useState<string>("");

  // Etats indépendants de chargement
  const [loadingCreation, setLoadingCreation] = useState(false);
  const [loadingCloture, setLoadingCloture] = useState(false);

  // Messages indépendants
  const [messageCreation, setMessageCreation] = useState("");
  const [errorCreation, setErrorCreation] = useState("");

  const [messageCloture, setMessageCloture] = useState("");
  const [errorCloture, setErrorCloture] = useState("");

  const fetchAnnees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comptable/tousAnnee`);
      const data: AnneeComptable[] = await response.json();
      setAnnees(data);
    } catch (err) {
      setErrorCloture("Impossible de récupérer les années.");
    }
  };

  useEffect(() => {
    fetchAnnees();
  }, []);

  const handleDuplication = async () => {
    setMessageCloture("");
    setErrorCloture("");

    if (!anneeActuelle) {
      setErrorCloture("Veuillez sélectionner une année valide à clôturer.");
      return;
    }

    setLoadingCloture(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comptable/cloturer/${anneeActuelle}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de la clôture.");

      setMessageCloture(data.message);
      fetchAnnees();
    } catch (error: any) {
      setErrorCloture(error.message || "Erreur inconnue.");
    } finally {
      setLoadingCloture(false);
    }
  };

  const handleCreationAnnee = async () => {
    setMessageCreation("");
    setErrorCreation("");

    if (!/^\d{4}$/.test(nouvelleAnnee)) {
      setErrorCreation("Veuillez entrer une année valide (4 chiffres).");
      return;
    }

    setLoadingCreation(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comptable/creerAnnee/${nouvelleAnnee}`,
        { method: "POST" }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la création.");

      setMessageCreation(data.message);
      setNouvelleAnnee("");
      fetchAnnees();
    } catch (error: any) {
      setErrorCreation(error.message || "Erreur inconnue.");
    } finally {
      setLoadingCreation(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bloc Création */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Créer une année</h2>

          <div className="mb-4">
            <label htmlFor="new-annee" className="block text-sm font-medium text-gray-700 mb-1">
              Entrer une nouvelle année
            </label>
            <input
              id="new-annee"
              type="text"
              value={nouvelleAnnee}
              onChange={(e) => setNouvelleAnnee(e.target.value)}
              placeholder="Ex: 2025"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCreationAnnee}
            disabled={loadingCreation}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
              loadingCreation ? "bg-gray-400 cursor-not-allowed" : "bg-teal-700 hover:bg-blue-700"
            }`}
          >
            {loadingCreation ? "Traitement en cours..." : "Créer l'année"}
          </button>

          {messageCreation && <p className="mt-4 text-green-600 font-medium">{messageCreation}</p>}
          {errorCreation && <p className="mt-4 text-red-600 font-medium">{errorCreation}</p>}
        </div>

        {/* Bloc Clôture */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Clôturer et dupliquer une année</h2>

          <div className="mb-4">
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner l’année à clôturer
            </label>
            <select
              id="annee"
              value={anneeActuelle}
              onChange={(e) => setAnneeActuelle(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisir une année --</option>
              {annees.map((a) => (
                <option key={a._id} value={a.annee}>
                  {a.annee}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleDuplication}
            disabled={loadingCloture}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
              loadingCloture ? "bg-gray-400 cursor-not-allowed" : "bg-teal-700 hover:bg-blue-700"
            }`}
          >
            {loadingCloture ? "Traitement en cours..." : "Clôturer et créer l'année suivante"}
          </button>

          {messageCloture && <p className="mt-4 text-green-600 font-medium">{messageCloture}</p>}
          {errorCloture && <p className="mt-4 text-red-600 font-medium">{errorCloture}</p>}
        </div>
      </div>

      {/* Bloc Liste des années */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Liste des années comptables</h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 text-sm rounded-md">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">Année</th>
                <th className="px-4 py-2 border">Statut</th>
                <th className="px-4 py-2 border">Date de clôture</th>
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
                  <td className="px-4 py-2 border">
                    {a.cloture && a.dateCloture
                      ? new Date(a.dateCloture).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {annees.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    Aucune année disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DuplicationAnnee;
