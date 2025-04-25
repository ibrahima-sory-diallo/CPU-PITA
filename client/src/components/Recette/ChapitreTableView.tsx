import React, { RefObject, useState, useMemo } from 'react';
import ModalEditParagraphe from './EditParagrapheModal';

interface Paragraphe {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number; 
  taux: number;
  encours: number;
}

interface ParagrapheMer {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  paragraphes: Paragraphe[];
  totalPrevision: number;
  totalRealisation: number;
  totalEncours: number;
}

interface Article {
  _id: string;
  numero: number;
  nom: string;
  paragraphesMers: ParagrapheMer[];
  totalPrevision: number;
  totalRealisation: number;
  totalEncours: number;
}

interface Chapitre {
  _id: string;
  numero: number;
  nom: string;
  prevision:number;
  realisation:number;
  taux: number;
  encours:number;
  hasArticle: boolean;
  articles: Article[];
  totalPrevision: number;
  totalRealisation: number;
  totalEncours: number;
}

interface Section {
  _id: string;
  name: string;
  titre: string;
}

interface Props {
  chapitres: Chapitre[];
  tableRef: RefObject<HTMLTableElement>;
  onOpenModalArticle: (chapitreId: string, callback?: () => void) => void;
  onOpenModalParagrapheMer: (articleId: string, callback?: () => void) => void;
  onOpenModalParagraphe: (paragrapheMerId: string, callback?: () => void) => void;
  onOpenModalInputation: (paragrapheId: string) => void;
  exportToExcel: () => void;
  exportToPDF: () => void;
  printTable: () => void;
  section: Section | null;
  totalSection: {
    prevision: number;
    realisation: number;
    encours: number;
  };
}

const ChapitreTableView: React.FC<Props> = ({
  chapitres,
  tableRef,
  onOpenModalArticle,
  onOpenModalParagrapheMer,
  onOpenModalParagraphe,
  onOpenModalInputation,
  exportToExcel,
  exportToPDF,
  printTable,
  section,
  totalSection
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedParagraphe, setSelectedParagraphe] = useState<Paragraphe | null>(null);

  const rowsPerPage = 15;
  const getTaux = (realisation: number, prevision: number) =>
    prevision > 0 ? `${((realisation / prevision) * 100).toFixed(0)} %` : '-';


  const onSaveParagraphe = async (updated: Paragraphe) => {
    try {

      const paragrapheId = updated._id;
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/paragraphe/updateParagraphe/${paragrapheId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'update : ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Réponse du serveur :', result);
  
      return true;
    } catch (error) {
      console.error('Erreur lors de la requête PUT:', error);
      return false;
    }
  };
    
  
  const flattenedRows = useMemo(() => {
    const rows: JSX.Element[] = [];

    chapitres.forEach((chapitre) => {
      rows.push(
        <tr key={chapitre._id} className="bg-gray-100">
          <td
            className="border border-gray-400 p-2 font-black cursor-pointer hover:bg-blue-100"
            title="Ajouter l'article"
            onClick={() => onOpenModalArticle(chapitre._id)}
          >
            {chapitre.numero}
          </td>
          <td className="border border-gray-400 p-2"></td>
          <td className="border border-gray-400 p-2"></td>
          <td className="border border-gray-400 p-2"></td>
          <td className="border border-gray-400 p-2 font-black">{chapitre.nom}</td>
          <td className="border border-gray-400 p-2 font-black">{chapitre.totalPrevision}</td>
          <td className="border border-gray-400 p-2 font-black">{chapitre.totalRealisation}</td>
          <td className="border border-gray-400 p-2 font-black">{getTaux(chapitre.totalRealisation, chapitre.totalPrevision)}</td>
          <td className="border border-gray-400 p-2 font-black">{chapitre.totalEncours}</td>
        </tr>
      );

      chapitre.articles.forEach((article) => {
        rows.push(
          <tr key={article._id} className="bg-gray-50">
            <td className="border border-gray-400 p-2"></td>
            <td
              className="border border-gray-400 p-2 font-bold cursor-pointer hover:bg-blue-100"
              title="Ajouter un paragraphe"
              onDoubleClick={() => onOpenModalParagrapheMer(article._id)}
            >
              {article.numero}
            </td>
            <td className="border border-gray-400 p-2"></td>
            <td className="border border-gray-400 p-2"></td>
            <td className="border border-gray-400 p-2 font-bold">{article.nom}</td>
            <td className="border border-gray-400 p-2 font-bold">{article.totalPrevision}</td>
            <td className="border border-gray-400 p-2 font-bold">{article.totalRealisation}</td>
            <td className="border border-gray-400 p-2 font-bold">{getTaux(article.totalRealisation, article.totalPrevision)}</td>
            <td className="border border-gray-400 p-2 font-bold">{article.totalEncours}</td>
          </tr>
        );

        article.paragraphesMers.forEach((paragrapheMer) => {
          rows.push(
            <tr key={paragrapheMer._id}>
              <td className="border border-gray-400 p-2"></td>
              <td className="border border-gray-400 p-2"></td>
              <td
                className="border border-gray-400 p-2 font-semibold cursor-pointer hover:bg-blue-100"
                title="Ajouter un sous paragraphe"
                onDoubleClick={() => onOpenModalParagraphe(paragrapheMer._id)}
              >
                {paragrapheMer.numero}
              </td>
              <td className="border border-gray-400 p-2"></td>
              <td className="border border-gray-400 p-2 font-semibold">{paragrapheMer.nom}</td>
              <td className="border border-gray-400 p-2 font-semibold">{paragrapheMer.totalPrevision}</td>
              <td className="border border-gray-400 p-2 font-semibold">{paragrapheMer.totalRealisation}</td>
              <td className="border border-gray-400 p-2 font-semibold">{getTaux(paragrapheMer.totalRealisation, paragrapheMer.totalPrevision)}</td>
              <td className="border border-gray-400 p-2 font-semibold">{paragrapheMer.totalEncours}</td>
            </tr>
          );

          paragrapheMer.paragraphes.forEach((paragraphe) => {
            rows.push(
              <tr key={paragraphe._id}>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>
                <td className="border border-gray-400 p-2"></td>
                <td
                  className="border border-gray-400 p-2 cursor-pointer hover:bg-teal-100"
                  title="Ajouter l'inputation"
                  onDoubleClick={() => onOpenModalInputation(paragraphe._id)}
                >
                  {paragraphe.numero} 🔗
                </td>
                <td
                  className="border border-gray-400 p-2 cursor-pointer hover:bg-green-100"
                  onDoubleClick={() => setSelectedParagraphe(paragraphe)}
                >
                  {paragraphe.nom}
                </td>
                <td className="border border-gray-400 p-2">{paragraphe.prevision}</td>
                <td className="border border-gray-400 p-2">{paragraphe.realisation || '-'}</td>
                <td className="border border-gray-400 p-2">{paragraphe.taux ? `${Math.round(paragraphe.taux)}%` : '-'}</td>
                <td className="border border-gray-400 p-2">{paragraphe.encours || '-'}</td>
              </tr>
            );
          });
        });
      });
    });

    const previsionTotal = totalSection.prevision;
    const realisationTotal = totalSection.realisation;
    const tauxTotal = getTaux(totalSection.realisation, totalSection.prevision);
    const encoursTotal = totalSection.encours;

    rows.push(
      <>
        {/* Ligne de total pour la section */}
        <tr key="total-section" className="bg-yellow-100 font-extrabold">
          <td className="border border-gray-400 p-2 text-center" colSpan={5}>
            TOTAL {section?.titre ?? "Section inconnue"}
          </td>
          <td className="border border-gray-400 p-2">{previsionTotal}</td>
          <td className="border border-gray-400 p-2">{realisationTotal}</td>
          <td className="border border-gray-400 p-2">{tauxTotal}</td>
          <td className="border border-gray-400 p-2">{encoursTotal}</td>
        </tr>

        {/* Vérification de "Section Investissement" */}
        {section?.titre === "Section Investissement" && (
          (() => {
            // Trouver le chapitre numéro 65
            const chapitre65 = chapitres.find(c => c.numero === 65);

            // Calculs des totaux
            const totalPrevisionReel = previsionTotal + (chapitre65?.prevision ?? 0);
            const totalRealisationReel = realisationTotal + (chapitre65?.realisation ?? 0);
            const totalEncoursReel = encoursTotal + (chapitre65?.encours ?? 0);

            // Calcul du taux de base
            const tauxBase = parseFloat(getTaux(totalSection.realisation, totalSection.prevision));

            // Calcul du taux brut (en ajoutant le taux de chapitre65)
            const tauxReelBrut = tauxBase + (chapitre65?.taux ?? 0);

            // Arrondi du taux
            const tauxReelArrondi = tauxReelBrut % 1 >= 0.5 ? Math.ceil(tauxReelBrut) : Math.floor(tauxReelBrut);

            return (
              <>
                {/* Total Réel pour la section Investissement */}
                <tr key="total-sectionReelle-1" className="bg-yellow-200 font-extrabold">
                  <td className="border border-gray-400 p-2 text-center" colSpan={5}>
                    TOTAL Réel {section.titre}
                  </td>
                  <td className="border border-gray-400 p-2">{totalPrevisionReel}</td>
                  <td className="border border-gray-400 p-2">{totalRealisationReel}</td>
                  <td className="border border-gray-400 p-2">{tauxReelArrondi} %</td>
                  <td className="border border-gray-400 p-2">{totalEncoursReel}</td>
                </tr>
              </>
            );
          })()
        )}
      </>
    );

    return rows;
  }, [chapitres, section, totalSection]);

  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-4">
        <button className="mt-2 bg-teal-800 text-white px-4 py-2 rounded" onClick={exportToExcel}>Exporter Excel</button>
        <button className="mt-2 px-4 bg-gradient-to-r from-teal-800 to-red-800 text-white py-2 rounded text-center" onClick={exportToPDF}>Exporter PDF</button>
        <button className="mt-2 bg-gray-800 text-white px-4 py-2 rounded" onClick={printTable}>Imprimer</button>
      </div>

      <h2 className="text-xl font-bold text-center mb-4 text-teal-900">
        Section : {section?.name ?? "Section inconnue"}
      </h2>

      <table ref={tableRef} className="table-auto w-full border-collapse border border-gray-800">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-600 p-2">CHAP</th>
            <th className="border border-gray-600 p-2">ART</th>
            <th className="border border-gray-600 p-2">PARAG</th>
            <th className="border border-gray-600 p-2">SOUS-PARAG</th>
            <th className="border border-gray-600 p-2">NOMENCLATURE</th>
            <th className="border border-gray-600 p-2">PREVISIONS</th>
            <th className="border border-gray-600 p-2">REALISATION</th>
            <th className="border border-gray-600 p-2">TAUX DE REALISATION</th>
            <th className="border border-gray-600 p-2">PRE. EXERCICE EN COURS</th>
          </tr>
        </thead>
        <tbody>
          {flattenedRows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          ⬅️ Précédent
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          onClick={() => setCurrentPage((p) => (p + 1) * rowsPerPage < flattenedRows.length ? p + 1 : p)}
          disabled={(currentPage + 1) * rowsPerPage >= flattenedRows.length}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Suivant ➡️
        </button>
      </div>
      {selectedParagraphe && (
  <ModalEditParagraphe
    paragraphe={selectedParagraphe}
    onClose={() => setSelectedParagraphe(null)}
    onSave={onSaveParagraphe}
  />
)}

    </div>
  );
};

export default ChapitreTableView;
