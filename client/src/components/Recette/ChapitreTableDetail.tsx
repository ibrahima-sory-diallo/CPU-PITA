// ChapitreTableLogic.tsx
import React, { useRef, useState } from 'react';
import { ModalParagrapheMerCreation } from './ModalParagrapheMer';
import ModalArticle from './ModalArticle';
import { ModalParagrapheCreation } from './ModalParagrapheCreation';
import { ModalInputation } from './ModalInputation';
import * as XLSX from 'xlsx';
import ChapitreTableView from './ChapitreTableView';

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
}

interface Article {
  _id: string;
  numero: number;
  nom: string;
  paragraphesMers: ParagrapheMer[];
}

interface Chapitre {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  encours:number;
  articles: Article[];
  hasArticle: boolean;
}
interface Section {
  _id: string;
  name: string;
  titre: string;
}

interface ChapitreTableProps {
  chapitres: Chapitre[];
  section: Section | null; 
  refreshChapitres: (sectionId: string) => void;

}

export const ChapitreTable: React.FC<ChapitreTableProps> = ({ chapitres = [], section,refreshChapitres   }) => {
  // Modals state
  const [isModalParagrapheMerOpen, setIsModalParagrapheMerOpen] = useState(false);
  const [isModalParagrapheOpen, setIsModalParagrapheOpen] = useState(false);
  const [isModalArticleOpen, setIsModalArticleOpen] = useState(false);
  const [isModalInputationOpen, setIsModalInputationOpen] = useState(false);

  // Selection IDs
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedChapitreIdForArticle, setSelectedChapitreIdForArticle] = useState<string | null>(null);
  const [selectedParagrapheId, setSelectedParagrapheId] = useState<string | null>(null);
  const [selectedParagrapheMerId, setSelectedParagrapheMerId] = useState<string | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  // Handlers for opening/closing modals
  const handleOpenModalParagrapheMer = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsModalParagrapheMerOpen(true);
  };

  const handleOpenModalParagraphe = (paragrapheMerId: string) => {
    setSelectedParagrapheMerId(paragrapheMerId);
    setIsModalParagrapheOpen(true);
  };

  const handleOpenModalArticle = (chapitreId: string) => {
    setSelectedChapitreIdForArticle(chapitreId);
    setIsModalArticleOpen(true);
  };

  const handleOpenModalInputation = (paragrapheId: string) => {
    setSelectedParagrapheId(paragrapheId);
    setIsModalInputationOpen(true);
  };

  const handleCloseModalParagrapheMer = () => setIsModalParagrapheMerOpen(false);
  const handleCloseModalParagraphe = () => setIsModalParagrapheOpen(false);
  const handleCloseModalArticle = () => setIsModalArticleOpen(false);

  const getParagrapheById = (id: string) => {
    for (let chapitre of chapitres) {
      for (let article of chapitre.articles) {
        for (let pm of article.paragraphesMers) {
          for (let p of pm.paragraphes) {
            if (p._id === id) return p;
          }
        }
      }
    }
    return null;
  };

  const calculateTotals = (chapitres: Chapitre[]) => {
    return (chapitres || []).map((chapitre) => {
      let totalPrevisionChapitre = 0;
      let totalRealisationChapitre = 0;
      let totalEncoursChapitre = 0;
  
      const articles = (chapitre.articles || []).map((article) => {
        let totalPrevisionArticle = 0;
        let totalRealisationArticle = 0;
        let totalEncoursArticle = 0;
  
        const paragraphesMers = (article.paragraphesMers || []).map((pm) => {
          let totalPrevisionPM = 0;
          let totalRealisationPM = 0;
          let totalEncoursPM = 0;
  
          (pm.paragraphes || []).forEach((p) => {
            totalPrevisionPM += p?.prevision || 0;
            totalRealisationPM += p?.realisation || 0;
            totalEncoursPM += p?.encours || 0;
          });
  
          totalPrevisionArticle += totalPrevisionPM;
          totalRealisationArticle += totalRealisationPM;
          totalEncoursArticle += totalEncoursPM;
  
          return {
            ...pm,
            totalPrevision: totalPrevisionPM,
            totalRealisation: totalRealisationPM,
            totalEncours: totalEncoursPM,
          };
        });
  
        totalPrevisionChapitre += totalPrevisionArticle;
        totalRealisationChapitre += totalRealisationArticle;
        totalEncoursChapitre += totalEncoursArticle;
  
        return {
          ...article,
          paragraphesMers,
          totalPrevision: totalPrevisionArticle,
          totalRealisation: totalRealisationArticle,
          totalEncours: totalEncoursArticle,
        };
      });
  
      return {
        ...chapitre,
        articles,
        totalPrevision: totalPrevisionChapitre,
        totalRealisation: totalRealisationChapitre,
        totalEncours: totalEncoursChapitre,
      };
    });
  };
  

  // Export functions
  const exportToExcel = () => {
    const table = document.querySelector('table');
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Budget' });
    XLSX.writeFile(wb, 'tableau_budgetaire.xlsx');
  };

  const exportToPDF = async () => {
    const table = document.querySelector('table') as HTMLElement;
    if (!table) return;

    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('l', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('tableau_budgetaire.pdf');
  };

  const printTable = () => {
    const printContent = tableRef.current?.outerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=1000,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tableau budgétaire</title>
            <style>
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid black; padding: 8px; text-align: center; }
              th { background-color: #f3f3f3; }
              h2 { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h2>Tableau budgétaire</h2>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const chapitresAvecTotaux = calculateTotals(chapitres);

  const totalSection = chapitresAvecTotaux.reduce(
    (acc, chapitre) => {
      acc.prevision += chapitre.totalPrevision || 0;
      acc.realisation += chapitre.totalRealisation || 0;
      acc.encours += chapitre.totalEncours || 0;
      return acc;
    },
    { prevision: 0, realisation: 0, encours: 0 }
  );

  
  return (
    <>
      {/* Table rendering */}
      <ChapitreTableView
        chapitres={chapitresAvecTotaux}
        tableRef={tableRef}
        onOpenModalArticle={handleOpenModalArticle}
        onOpenModalParagrapheMer={handleOpenModalParagrapheMer}
        onOpenModalParagraphe={handleOpenModalParagraphe}
        onOpenModalInputation={handleOpenModalInputation}
        exportToExcel={exportToExcel}
        exportToPDF={exportToPDF}
        printTable={printTable}
        totalSection={totalSection}
        section={section}

      />

      {/* Modals */}
      {isModalArticleOpen && selectedChapitreIdForArticle && (
        <ModalArticle
          chapitreId={selectedChapitreIdForArticle}
          onClose={handleCloseModalArticle}
                    onSuccess={() => {
            handleCloseModalParagraphe(); // Fermer la modale
            if (section) {
              refreshChapitres(section._id);
            }
          }}
        />
      )}

      {isModalParagrapheMerOpen && selectedArticleId && (
        <ModalParagrapheMerCreation
          isOpen={isModalParagrapheMerOpen}
          articleId={selectedArticleId}
          onClose={handleCloseModalParagrapheMer}
          onSuccess={() => {
            handleCloseModalParagraphe(); // Fermer la modale
            if (section) {
              refreshChapitres(section._id);
            }
          }}
        />
      )}

      {isModalParagrapheOpen && selectedParagrapheMerId && (
        <ModalParagrapheCreation
          isOpen={isModalParagrapheOpen}
          paragrapheMerId={selectedParagrapheMerId}
          onClose={handleCloseModalParagraphe}
          onSuccess={() => {
            handleCloseModalParagraphe(); // Fermer la modale
            if (section) {
              refreshChapitres(section._id);
            }
          }}
          
        />
      )}

      {isModalInputationOpen && selectedParagrapheId && (
        <ModalInputation
          paragraphe={getParagrapheById(selectedParagrapheId)}
          onClose={() => setIsModalInputationOpen(false)}
        />
      )}
    </>
  );
};
