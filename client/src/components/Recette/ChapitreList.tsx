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

interface Section {
  _id: string;
  name: string;
  titre: string; // "Fonctionnement" ou "Investissement"
}

interface Totaux {
  prevision: number;
  realisation: number;
  encours: number;
  taux: number;
}

interface ChapitreTablesProps {
  chapitres: Chapitre[];
  refreshChapitres: (sectionId: string) => void;
  section: Section | null;
  sections: Section[]; // 👈 nécessaire pour calculer fonctionnement vs investissement
}

export const ChapitreTables: React.FC<ChapitreTablesProps> = ({
  chapitres: initialChapitres,
  section,
  sections,
}) => {
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres);
  const [editingChapitre, setEditingChapitre] = useState<Chapitre | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [totauxFonctionnement, setTotauxFonctionnement] = useState<Totaux>({
    prevision: 0,
    realisation: 0,
    encours: 0,
    taux: 0,
  });

  const [totauxInvestissement, setTotauxInvestissement] = useState<Totaux>({
    prevision: 0,
    realisation: 0,
    encours: 0,
    taux: 0,
  });

  const [recetteReelleInvestissement, setRecetteReelleInvestissement] = useState<Totaux>({
    prevision: 0,
    realisation: 0,
    encours: 0,
    taux: 0,
  });

  const handleDoubleClick = (chapitre: Chapitre) => {
    setEditingChapitre(chapitre);
    setMessage(null);
  };

  const handleCloseModal = () => {
    setEditingChapitre(null);
  };

  const handleSave = async () => {
    if (!editingChapitre) return;

    setChapitres((prev) =>
      prev.map((chap) => (chap._id === editingChapitre._id ? editingChapitre : chap))
    );

    handleCloseModal();
    setMessage({ type: 'success', text: 'Chapitre mis à jour localement.' });

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
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Échec de la synchronisation avec le serveur." });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    setChapitres(initialChapitres);
  }, [initialChapitres]);

  useEffect(() => {
    if (!sections || !section) return;

    const fonctionnement = sections.find(s => s.name === 'Recette' && s.titre === 'Fonctionnement');
    const investissement = sections.find(s => s.name === 'Recette' && s.titre === 'Investissement');
    if (!fonctionnement || !investissement) return;

    const chapFonct = chapitres.filter(c => c.sectionId === fonctionnement._id);
    const chapInvest = chapitres.filter(c => c.sectionId === investissement._id);

    const totalFonct = chapFonct.reduce((acc, ch) => {
      acc.prevision += ch.prevision || 0;
      acc.realisation += ch.realisation || 0;
      acc.encours += ch.encours || 0;
      return acc;
    }, { prevision: 0, realisation: 0, encours: 0, taux: 0 });

    const totalInvest = chapInvest.reduce((acc, ch) => {
      acc.prevision += ch.prevision || 0;
      acc.realisation += ch.realisation || 0;
      acc.encours += ch.encours || 0;
      return acc;
    }, { prevision: 0, realisation: 0, encours: 0, taux: 0 });

    totalFonct.taux = totalFonct.prevision > 0 ? (totalFonct.realisation / totalFonct.prevision) * 100 : 0;
    totalInvest.taux = totalInvest.prevision > 0 ? (totalInvest.realisation / totalInvest.prevision) * 100 : 0;

    setTotauxFonctionnement(totalFonct);
    setTotauxInvestissement(totalInvest);

    const recetteReelle = {
      prevision: totalInvest.prevision - 0.6 * totalFonct.prevision,
      realisation: totalInvest.realisation - 0.6 * totalFonct.realisation,
      encours: totalInvest.encours - 0.6 * totalFonct.encours,
      taux: 0,
    };
    recetteReelle.taux = recetteReelle.prevision > 0
      ? (recetteReelle.realisation / recetteReelle.prevision) * 100
      : 0;

    setRecetteReelleInvestissement(recetteReelle);
  }, [chapitres, section, sections]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Chapitres</h2>

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
            <tr key={chapitre._id} className="hover:bg-gray-100 cursor-pointer" onDoubleClick={() => handleDoubleClick(chapitre)}>
              <td className="border border-gray-300 p-2">{chapitre.numero}</td>
              <td className="border border-gray-300 p-2">{chapitre.nom}</td>
              <td className="border border-gray-300 p-2">{chapitre.prevision}</td>
              <td className="border border-gray-300 p-2">{chapitre.realisation}</td>
              <td className="border border-gray-300 p-2">{Math.round(chapitre.taux)}%</td>
              <td className="border border-gray-300 p-2">{chapitre.encours}</td>
            </tr>
          ))}

          {section?.titre === 'Fonctionnement' && (
            <tr className="font-bold bg-gray-200">
              <td colSpan={2} className="border border-gray-300 p-2">Total {section.name} {section.titre}</td>
              <td className="border border-gray-300 p-2">{totauxFonctionnement.prevision}</td>
              <td className="border border-gray-300 p-2">{totauxFonctionnement.realisation}</td>
              <td className="border border-gray-300 p-2">{Math.round(totauxFonctionnement.taux)}%</td>
              <td className="border border-gray-300 p-2">{totauxFonctionnement.encours}</td>
            </tr>
          )}

          {section?.titre === 'Investissement' && (
            <>
              <tr className="font-bold bg-gray-300">
                <td colSpan={2} className="border border-gray-300 p-2">Total {section.name} {section.titre}</td>
                <td className="border border-gray-300 p-2">{totauxInvestissement.prevision}</td>
                <td className="border border-gray-300 p-2">{totauxInvestissement.realisation}</td>
                <td className="border border-gray-300 p-2">{Math.round(totauxInvestissement.taux)}%</td>
                <td className="border border-gray-300 p-2">{totauxInvestissement.encours}</td>
              </tr>
              <tr className="font-bold bg-green-100">
                <td colSpan={2} className="border border-gray-300 p-2">Recette Réelle Investissement</td>
                <td className="border border-gray-300 p-2">{recetteReelleInvestissement.prevision.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{recetteReelleInvestissement.realisation.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">{recetteReelleInvestissement.taux.toFixed(2)}%</td>
                <td className="border border-gray-300 p-2">{recetteReelleInvestissement.encours.toFixed(2)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Modal édition */}
      {editingChapitre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Modifier le chapitre</h3>

            {message && (
              <div className={`mb-4 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <label className="block mb-2">
              Numéro :
              <input type="number" value={editingChapitre.numero}
                onChange={(e) => setEditingChapitre({ ...editingChapitre, numero: +e.target.value })}
                className="border p-1 w-full mt-1"
              />
            </label>

            <label className="block mb-2">
              Nom :
              <input type="text" value={editingChapitre.nom}
                onChange={(e) => setEditingChapitre({ ...editingChapitre, nom: e.target.value })}
                className="border p-1 w-full mt-1"
              />
            </label>

            <label className="block mb-2">
              Prévision :
              <input type="number" value={editingChapitre.prevision}
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
