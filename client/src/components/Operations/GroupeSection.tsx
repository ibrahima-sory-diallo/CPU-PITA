import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiMoneyCheck1, CiMoneyBill } from "react-icons/ci";

// Interface pour définir un chapitre
interface Chapitre {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
}

// Type pour regrouper les chapitres par section
type SectionGrouped = {
  [sectionName: string]: Chapitre[];
};

// Fonction pour récupérer l'icône en fonction du nom de la section
const getSectionIcon = (sectionName: string) => {
  switch (sectionName.toLowerCase()) {
    case "recette":
      return (
        <CiMoneyCheck1 className="rounded-full bg-teal-500 text-4xl text-white p-1" />
      );
    case "dépense":
    case "depense":
      return (
        <CiMoneyBill className="rounded-full bg-teal-500 text-4xl text-white p-1" />
      );
    default:
      return (
        <CiMoneyBill className="rounded-full bg-gray-400 text-4xl text-white p-1" />
      );
  }
};

const ChapitresParSection: React.FC = () => {
  const [data, setData] = useState<SectionGrouped>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapitresParSection = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chapitre/groupBySectionName`);
        setData(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des chapitres par section :', err);
        setError('Impossible de récupérer les données des chapitres.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapitresParSection();
  }, []);

  // Afficher le message de chargement
  if (loading) return <div className="text-center p-4">Chargement...</div>;

  // Afficher un message d'erreur si la récupération échoue
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="transition-all flex gap-4 p-4 sm:px-7 w-full">
      {Object.entries(data).map(([sectionName, chapitres]) => {
        const totalRealisation = chapitres.reduce(
          (sum, ch) => sum + ch.realisation,
          0
        );

        return (
          <div
            key={sectionName}
            className="flex flex-col justify-between w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              {getSectionIcon(sectionName)}
              <h3 className="text-3xl font-semibold text-gray-800 capitalize">
                {sectionName}
              </h3>
            </div>

            <div className="text-sm text-gray-500 mb-1">
              Nombre de chapitres : {chapitres.length}
            </div>

            <div className="text-base font-bold text-teal-600 mt-2 ">
              Total Réalisation : {totalRealisation.toFixed(2)} FGN
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChapitresParSection;
