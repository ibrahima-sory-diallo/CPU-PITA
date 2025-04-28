import React, { useState, useEffect } from 'react';

interface Article {
  _id: string;
  numero: number;
  nom: string;
}

interface Chapitre {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  encours: number;
  articles: Article[];
  sectionId: string;
}

interface ChapitreTablesProps {
  chapitres: Chapitre[];
  refreshChapitres: (sectionId: string) => void;
}

export const ChapitreTables: React.FC<ChapitreTablesProps> = ({ chapitres: initialChapitres, }) => {
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres);
  const [editingChapitre, setEditingChapitre] = useState<Chapitre | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Synchroniser chapitres si la prop change
  useEffect(() => {
    setChapitres(initialChapitres);
  }, [initialChapitres]);

  const handleDoubleClick = (chapitre: Chapitre) => {
    setEditingChapitre(chapitre);
    setMessage(null);
  };

  const handleCloseModal = () => {
    setEditingChapitre(null);
  };

  const handleSave = async () => {
    if (!editingChapitre) return;
  
    // ✅ Mise à jour immédiate locale (optimistic update)
    setChapitres((prevChapitres) =>
      prevChapitres.map((chap) =>
        chap._id === editingChapitre._id ? editingChapitre : chap
      )
    );
  
    // ✅ Fermer la modale immédiatement
    handleCloseModal();
  
    // ✅ Message de succès immédiat
    setMessage({ type: 'success', text: 'Chapitre mis à jour localement.' });
  
    // ✅ Envoi en arrière-plan
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chapitre/updateChapitre/${editingChapitre._id}`,
        {
          method: 'PUT',
          body: JSON.stringify(editingChapitre),
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      if (!res.ok) throw new Error('Erreur serveur');
  
      // (Optionnel) re-synchroniser après si tu veux
      // await refreshChapitres(editingChapitre.sectionId);
  
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Échec de la synchronisation avec le serveur." });
    }
  
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  

  const totals = chapitres.reduce(
    (acc, chapitre) => {
      acc.prevision += chapitre.prevision??0;
      acc.realisation += chapitre.realisation??0;
      acc.taux += (chapitre.taux??0) * 100;
      acc.encours += chapitre.encours??0;
      return acc;
    },
    { prevision: 0, realisation: 0, encours: 0, taux: 0 }
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Chapitres</h2>

      {/* Message global */}
      {message && !editingChapitre && (
        <div className={`mb-4 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <table className="table-auto w-full text-sm border-collapse border border-gray-300 shadow-md rounded-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 p-2">CHAPITRE</th>
            <th className="border border-gray-300 p-2">NOMENCLATURE</th>
            <th className="border border-gray-300 p-2">PREVISION</th>
            <th className="border border-gray-300 p-2">REALISATION</th>
            <th className="border border-gray-300 p-2">TAUX DE REALISATION</th>
            <th className="border border-gray-300 p-2">PRE. EXERCICE EN COURS</th>
          </tr>
        </thead>
        <tbody>
          {chapitres.map((chapitre) => (
            <tr
              key={chapitre._id}
              className="hover:bg-gray-100 cursor-pointer"
              onDoubleClick={() => handleDoubleClick(chapitre)}
            >
              <td className="border border-gray-300 p-2">{chapitre.numero}</td>
              <td className="border border-gray-300 p-2">{chapitre.nom}</td>
              <td className="border border-gray-300 p-2">{chapitre.prevision}</td>
              <td className="border border-gray-300 p-2">{chapitre.realisation}</td>
              <td className="border border-gray-300 p-2">{`${Math.round(chapitre.taux)} %`}</td>
              <td className="border border-gray-300 p-2">{chapitre.encours}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-200">
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">Total</td>
            <td className="border border-gray-300 p-2">{totals.prevision}</td>
            <td className="border border-gray-300 p-2">{totals.realisation}</td>
            <td className="border border-gray-300 p-2">{`${Math.round(totals.taux)} %`}</td>
            <td className="border border-gray-300 p-2">{totals.encours}</td>
          </tr>
        </tbody>
      </table>

      {/* Modale d'édition */}
      {editingChapitre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Modifier le chapitre</h3>

            {/* Message local dans modale */}
            {message && (
              <div className={`mb-4 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <label className="block mb-2">
              Numéro :
              <input
                type="number"
                value={editingChapitre.numero}
                onChange={(e) => setEditingChapitre({ ...editingChapitre, numero: +e.target.value })}
                className="border p-1 w-full mt-1"
              />
            </label>
            <label className="block mb-2">
              Nom :
              <input
                type="text"
                value={editingChapitre.nom}
                onChange={(e) => setEditingChapitre({ ...editingChapitre, nom: e.target.value })}
                className="border p-1 w-full mt-1"
              />
            </label>
            <label className="block mb-2">
              Prevision :
              <input
                type="number"
                value={editingChapitre.prevision}
                onChange={(e) => setEditingChapitre({ ...editingChapitre, prevision: +e.target.value })}
                className="border p-1 w-full mt-1"
              />
            </label>
            <div className="flex justify-end mt-4 gap-2">
              <button className="bg-gray-300 px-4 py-1 rounded" onClick={handleCloseModal}>
                Annuler
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleSave}>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
