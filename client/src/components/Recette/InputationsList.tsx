import React, { useRef, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

interface Inputation {
  _id: string;
  numero: number;
  date: string;
  mdt: string;
  beneficiaire: string;
  montant: number;
  montantCumulle: number;
}

interface InputationsListProps {
  inputations: Inputation[];
  paragrapheNom: string;
  onRefresh: () => void;
}

export const InputationsList: React.FC<InputationsListProps> = ({
  inputations,
  paragrapheNom,
  onRefresh,
}) => {
  const [editingInputation, setEditingInputation] = useState<Inputation | null>(null);
  const [formData, setFormData] = useState<Partial<Inputation>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputationToDelete, setInputationToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [numeroFilter, setNumeroFilter] = useState<number | string>('');
  const [beneficiaireFilter, setBeneficiaireFilter] = useState<string>('');
  const [mdtFilter, setMdtFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const tableRef = useRef<HTMLTableElement>(null);

  const uniqueNumeros = Array.from(new Set(inputations.map((i) => i.numero)));

  const handleDelete = async () => {
    if (inputationToDelete) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/inputation/deleteInputation/${inputationToDelete}`,
          { method: 'DELETE' }
        );
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        setNotification("Imputation supprimée avec succès !");
        onRefresh();
      } catch (error) {
        console.error(error);
        setNotification("Erreur lors de la suppression.");
      } finally {
        setShowDeleteModal(false);
        setInputationToDelete(null);
      }
    }
  };

  const handleEdit = (inputation: Inputation) => {
    setEditingInputation(inputation);
    setFormData(inputation);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInputation) return;
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inputation/updateInputation/${editingInputation._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            numero: formData.numero,
            date: formData.date,
            mdt: formData.mdt,
            beneficiaire: formData.beneficiaire,
            montant: formData.montant,
          }),
        }
      );
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
  
      setNotification("Imputation mise à jour avec succès !");
      setEditingInputation(null);
      onRefresh();
    } catch (error) {
      console.error(error);
      setNotification("Erreur lors de la mise à jour.");
    }
  };
  

  const filteredInputations = inputations.filter((i) => {
    return (
      (numeroFilter === '' || i.numero === Number(numeroFilter)) &&
      (beneficiaireFilter === '' || i.beneficiaire.toLowerCase().includes(beneficiaireFilter.toLowerCase())) &&
      (mdtFilter === '' || i.mdt.toLowerCase().includes(mdtFilter.toLowerCase())) &&
      (dateFilter === '' || i.date.includes(dateFilter))
    );
  });

  const totalMontant = filteredInputations.reduce((sum, i) => sum + i.montant, 0);

  const exportToExcel = () => {
    // Créer une feuille de calcul avec les données filtrées
    const worksheet = XLSX.utils.json_to_sheet(filteredInputations.map(i => ({
      Numéro: i.numero,
      Date: i.date,
      MDT: i.mdt,
      Bénéficiaire: i.beneficiaire,
      Montant: i.montant,
      "Montant Cumulé": i.montantCumulle,
    })));
  
    // Créer un nouveau classeur
    const workbook = XLSX.utils.book_new();
    
    // Ajouter la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Imputations");
    
    // Exporter le classeur au format Excel
    XLSX.writeFile(workbook, `Imputations_${paragrapheNom}.xlsx`);
  };

  const printTable = () => {
    const printContent = tableRef.current?.outerHTML;
    if (!printContent) return;
  
    const printWindow = window.open('', '', 'width=1000,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imputations - ${paragrapheNom}</title>
            <style>
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid black; padding: 8px; }
              th { background-color: #f3f3f3; }
              .no-print { display: none !important; }
            </style>
          </head>
          <body>
            <h2>Imputations pour ${paragrapheNom}</h2>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">Imputations pour {paragrapheNom}</h3>
        <div className="space-x-2 flex">
          <button onClick={exportToExcel} className="bg-teal-700 text-white px-3   hover:bg-blue-700 rounded-md">
            Exporter Excel
          </button>
          <button onClick={printTable} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-700">
            Imprimer
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-4">
        <select value={numeroFilter} onChange={(e) => setNumeroFilter(e.target.value)} className="p-2 border rounded mr-2">
          <option value="">Filtrer par numéro</option>
          {uniqueNumeros.map((numero) => (
            <option key={numero} value={numero}>{numero}</option>
          ))}
        </select>
        <input type="text" value={beneficiaireFilter} onChange={(e) => setBeneficiaireFilter(e.target.value)} placeholder="Filtrer par bénéficiaire" className="p-2 border rounded mr-2" />
        <input type="text" value={mdtFilter} onChange={(e) => setMdtFilter(e.target.value)} placeholder="Filtrer par MDT" className="p-2 border rounded mr-2" />
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded" />
      </div>

      {notification && (
        <div className={`p-2 mb-4 rounded border ${notification.includes("Erreur") ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-teal-700'}`}>
          {notification}
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-y-auto max-h-96">
        <table ref={tableRef} className="table-auto w-full text-sm border-collapse border border-gray-300 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-green-600 p-2">Numéro</th>
              <th className="border border-green-600 p-2">Date</th>
              <th className="border border-green-600 p-2">MDT</th>
              <th className="border border-green-600 p-2">Bénéficiaire</th>
              <th className="border border-green-600 p-2">Montant</th>
              <th className="border border-green-600 p-2">Montant Cumulé</th>
              <th className="border border-green-600 p-2 text-center no-print">Actions</th> {/* <- Modifié ici */}
            </tr>
          </thead>
          <tbody>
            {filteredInputations.map((inputation) => (
              <tr key={inputation._id} className="hover:bg-gray-100">
                <td className="border border-green-600 p-2">{inputation.numero}</td>
                <td className="border border-green-600 p-2">{inputation.date}</td>
                <td className="border border-green-600 p-2">{inputation.mdt}</td>
                <td className="border border-green-600 p-2">{inputation.beneficiaire}</td>
                <td className="border border-green-600 p-2">{inputation.montant}</td>
                <td className="border border-green-600 p-2">{inputation.montantCumulle}</td>
                <td className="border border-green-600 p-2 text-center space-x-2 no-print"> {/* <- Modifié ici */}
                  <button onClick={() => handleEdit(inputation)} className="text-teal-700 hover:text-blue-800 mr-2"><FaEdit /></button>
                  <button onClick={() => { setInputationToDelete(inputation._id); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border border-green-600 bg-gray-200 font-bold">
              <td className="border border-green-600 p-2">Totaux</td>
              <td colSpan={3}></td>
              <td className="border border-green-600 p-2">{totalMontant}</td>

              <td colSpan={1} className=" border border-green-600 no-print"></td> {/* <- Modifié ici */}
            </tr>
          </tfoot>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cette imputation ?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-400 text-white px-4 py-1 rounded-md">
                Annuler
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-1 rounded-md">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingInputation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Modifier l'imputation</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2">Numéro :
                <input type="number" value={formData.numero ?? ''} onChange={(e) => setFormData({ ...formData, numero: Number(e.target.value) })} className="block border p-1 w-full" />
              </label>
              <label className="block mb-2">Date :
                <input type="date" value={formData.date ?? ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="block border p-1 w-full" />
              </label>
              <label className="block mb-2">MDT :
                <input type="text" value={formData.mdt ?? ''} onChange={(e) => setFormData({ ...formData, mdt: e.target.value })} className="block border p-1 w-full" />
              </label>
              <label className="block mb-2">Bénéficiaire :
                <input type="text" value={formData.beneficiaire ?? ''} onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })} className="block border p-1 w-full" />
              </label>
              <label className="block mb-2">Montant :
                <input type="number" value={formData.montant ?? ''} onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })} className="block border p-1 w-full" />
              </label>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingInputation(null)} className="bg-gray-500 text-white px-4 py-1 rounded">
                  Annuler
                </button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-1 rounded-md">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
