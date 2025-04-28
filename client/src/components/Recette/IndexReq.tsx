import React, { useEffect, useState } from 'react';
import ChapitreForm from './ChapitreForm';
import { ChapitreTable } from './ChapitreTableDetail';
import { ChapitreTables } from './ChapitreList';


interface Section {
  _id: string;
  name: string;
  titre: string;
}

interface Chapitre {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  encours: number; 
  articles: any[];
  sectionId: string;
  hasArticle: boolean;
}

interface SectionFonctionnementProps {
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

export const SectionFonctionnement: React.FC<SectionFonctionnementProps> = ({
  selectedItem,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [annees, setAnnees] = useState<number[]>([]);
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [loadingSections, setLoadingSections] = useState<boolean>(false);
  const [loadingChapitres, setLoadingChapitres] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnneeId, setSelectedAnneeId] = useState<number>(new Date().getFullYear());
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [viewDetails, setViewDetails] = useState<boolean>(false);



  const fetchAnnees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comptable/tousAnnee`);
      const data = await response.json();
      setAnnees(data.map((annee: { annee: number }) => annee.annee));
    } catch (error) {
      setError('Erreur lors de la récupération des années.');
      console.error('Erreur lors de la récupération des années:', error);
    }
  };

  const fetchSections = async (anneeId: number) => {
    setLoadingSections(true);
    const url = `${import.meta.env.VITE_API_URL}/api/section/sections/annee/${anneeId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Aucune section trouvée pour cette année.');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des sections.');
      console.error('Erreur lors de la récupération des sections:', error);
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchChapitres = async (sectionId: string) => {
    setLoadingChapitres(true);
    setChapitres([]);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chapitre/getChapitresBySection/${sectionId}`
      );
      const data = await response.json();
      setChapitres(data.chapitres || []);
    } catch (error) {
      setError('Erreur lors de la récupération des chapitres.');
      console.error('Erreur lors de la récupération des chapitres:', error);
    } finally {
      setLoadingChapitres(false);
    }
  };

  const fetchChapitresDetails = async (sectionId: string, annee: string) => {
    setLoadingChapitres(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chapitre/sectionDetails/${sectionId}/${annee}`
      );
      const data = await response.json();
      if (data.section && data.section.chapitres) {
        setChapitres(data.section.chapitres || []);
      } else {
        setError('Aucun chapitre trouvé pour cette section.');
      }
    } catch (error) {
      setError('Erreur lors de la récupération des chapitres.');
      console.error('Erreur lors de la récupération des chapitres:', error);
    } finally {
      setLoadingChapitres(false);
    }
  };

  useEffect(() => {
    fetchAnnees();
  }, []);

  useEffect(() => {
    if (selectedAnneeId) {
      fetchSections(selectedAnneeId);
    }
  }, [selectedAnneeId]);

  const handleAnneeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setSelectedAnneeId(selectedYear);
  };

  const handleChapitreClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setViewDetails(false);
    fetchChapitres(sectionId);
  };

  const handleChapitreDetailsClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setViewDetails(true);
    fetchChapitresDetails(sectionId, selectedAnneeId.toString());
  };

  const handleCreateChapitre = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const refreshChapitres = (sectionId: string) => {
    if (viewDetails) {
      fetchChapitresDetails(sectionId, selectedAnneeId.toString());
    } else {
      fetchChapitres(sectionId);
    }
  };

  const handleChapitreCreated = () => {
    refreshChapitres(selectedSectionId!);
    setIsFormOpen(false);
  };


  
  

  const filteredSections = selectedItem
    ? sections.filter((section) => section.name === selectedItem)
    : sections;

  return (
    <div className="w-full">
      <div>
      <h1 className="text-3xl text-center font-bold ">Sections</h1>  
      <select
        value={selectedAnneeId}
        onChange={handleAnneeChange}
        className=" p-2 border rounded mb-4  "
      >
        {annees.map((annee) => (
          <option key={annee} value={annee}>
            {annee}
          </option>
        ))}
      </select>
      </div>

      {loadingSections ? (
        <p>Chargement des sections...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 text-center">
          {filteredSections.map((section) => (
            <div key={section._id} className="bg-white p-3 rounded shadow m-1">
              <h2 className="text-xl font-bold">{section.name}</h2>
              <p className='font-bold'>TITRE :{section.titre}</p>

              <button
                className="mt-2 px-4 py-2 bg-teal-700 text-white rounded m-1"
                onClick={() => handleChapitreClick(section._id)}
                disabled={loadingChapitres}
              >
                {loadingChapitres ? 'Chargement des chapitres...' : "VUE D'ENSEMBLE"}
              </button>

              <button
                className="mt-2 px-4 bg-gradient-to-r from-teal-800 to-green-700 text-white py-2 rounded text-center"
                onClick={() => handleChapitreDetailsClick(section._id)}
              >
                DEVELOPPEMENT
              </button>

              <button
                className="mt-2 px-4 py-2 bg-teal-700 text-white rounded m-1"
                onClick={() => handleCreateChapitre(section._id)}
              >
                Créer chapitre
              </button>


            </div>
          ))}
        </div>
      )}
      {viewDetails ? (
        (() => {
          const selectedSection = sections.find((s) => s._id === selectedSectionId);
          return chapitres.length > 0 && selectedSection ? (
            <ChapitreTable
              chapitres={chapitres}
              refreshChapitres={refreshChapitres}
              section={selectedSection}
            />
          ) : null;
        })()
      ) : (
        chapitres.length > 0 && (
          <ChapitreTables
            chapitres={chapitres}
            refreshChapitres={refreshChapitres}
          />
        )
      )}


      {isFormOpen && selectedSectionId && (
        <ChapitreForm
          sectionId={selectedSectionId}
          onClose={handleFormClose}
          onSuccess={handleChapitreCreated}
        />
      )}

    </div>
  );
};
