// src/hooks/useInputationsParMoisParSection.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Operation {
  mois: string;
  recettes: number;
  depenses: number;
}

export const useInputationsParMoisParSection = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [totalRecettes, setTotalRecettes] = useState(0);
  const [totalDepenses, setTotalDepenses] = useState(0);
  const [solde, setSolde] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}api/inputation/getInputationsParMoisParSection`
        );

        const data = res.data;
        const recettesParMois: Record<string, number> = {};
        const depensesParMois: Record<string, number> = {};
        const moisSet: Set<string> = new Set();

        for (const section in data) {
          const moisData = data[section];
          for (const mois in moisData) {
            const montantTotal = moisData[mois].reduce(
              (acc: number, inp: any) => acc + inp.montant,
              0
            );
            moisSet.add(mois);
            if (section.toLowerCase().includes('recette')) {
              recettesParMois[mois] = (recettesParMois[mois] || 0) + montantTotal;
            } else {
              depensesParMois[mois] = (depensesParMois[mois] || 0) + montantTotal;
            }
          }
        }

        const moisList = Array.from(moisSet).sort(
          (a, b) => new Date(`2023-${a}-01`).getTime() - new Date(`2023-${b}-01`).getTime()
        );

        let totalRecette = 0;
        let totalDepense = 0;
        const formattedOperations: Operation[] = moisList.map((mois) => {
          const recettes = recettesParMois[mois] || 0;
          const depenses = depensesParMois[mois] || 0;
          totalRecette += recettes;
          totalDepense += depenses;
          return { mois, recettes, depenses };
        });

        setOperations(formattedOperations);
        setTotalRecettes(totalRecette);
        setTotalDepenses(totalDepense);
        setSolde(totalRecette - totalDepense);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { operations, totalRecettes, totalDepenses, solde, loading };
};
