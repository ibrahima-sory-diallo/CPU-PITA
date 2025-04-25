import React, { useEffect, useState } from "react";
import axios from "axios";
import TableauSyntheseMensuelle from "./TableauSyntheseMansuelle";


interface Inputation {
  _id: string;
  montant: number;
  date?: string;
  mois?: string;
  section?: string;
}

interface InputationsParMois {
  [mois: string]: Inputation[];
}

interface DataParSection {
  [sectionName: string]: InputationsParMois;
}

const InputationsParMoisParSection: React.FC = () => {
  const [data, setData] = useState<DataParSection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soldeAnneePrecedente, setSoldeAnneePrecedente] = useState<number>(0);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
      const fetchInputations = async () => {
        try {
          const res = await axios.get<DataParSection>(`${import.meta.env.VITE_API_URL}/api/inputation/getInputationsParMoisParSection`);
          console.log("Données reçues:", res.data);
          setData(res.data);
        } catch (err) {
          setError("Erreur lors du chargement des données");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    

    const fetchSoldePrecedent = async () => {
      try {
        const res = await axios.get<Inputation[]>(
          `${import.meta.env.VITE_API_URL}/api/inputation/getSoldeAnneePrecedente/${currentYear - 1}`
        );
        const recettes = res.data
          .filter((i) => i.section?.toLowerCase().includes("recette"))
          .reduce((sum, i) => sum + i.montant, 0);

        const depenses = res.data
          .filter((i) => i.section?.toLowerCase().includes("dépense") || i.section?.toLowerCase().includes("depense"))
          .reduce((sum, i) => sum + i.montant, 0);

        const solde = recettes - depenses;
        setSoldeAnneePrecedente(solde);
      } catch (err) {
        console.error("Erreur lors du chargement du solde précédent", err);
      }
    };

    fetchInputations();
    fetchSoldePrecedent();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const moisSet = new Set<string>();
  const recettesParMois: Record<string, number> = {};
  const depensesParMois: Record<string, number> = {};

  Object.entries(data).forEach(([section, moisData]) => {
    Object.entries(moisData).forEach(([mois, inputations]) => {
      moisSet.add(mois);
      const total = inputations.reduce((sum, inp) => sum + inp.montant, 0);
      if (section.toLowerCase().includes("recette")) {
        recettesParMois[mois] = (recettesParMois[mois] || 0) + total;
      } else if (section.toLowerCase().includes("dépense") || section.toLowerCase().includes("depense")) {
        depensesParMois[mois] = (depensesParMois[mois] || 0) + total;
      }
    });
  });

  const moisList = Array.from(moisSet).sort(
    (a, b) => new Date(`2023-${a}-01`).getTime() - new Date(`2023-${b}-01`).getTime()
  );

  let totalRecette = 0;
  let totalDepenses = 0;

  const operations = moisList.map((mois) => {
    const recettes = recettesParMois[mois] || 0;
    const depenses = depensesParMois[mois] || 0;
    totalRecette += recettes;
    totalDepenses += depenses;
    return {
      id: mois,
      mois,
      recettes,
      depenses,
    };
  });

  const totalRecettes = totalRecette + soldeAnneePrecedente;
  const solde = totalRecettes - totalDepenses;

  return (
    <TableauSyntheseMensuelle
      currentYear={currentYear}
      soldeAnneePrecedente={soldeAnneePrecedente}
      operations={operations}
      totalRecettes={totalRecettes}
      totalDepenses={totalDepenses}
      solde={solde}
    />
  );
};

export default InputationsParMoisParSection;
