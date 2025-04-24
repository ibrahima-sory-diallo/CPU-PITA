import React, { useState } from 'react';

interface ChapitreFormProps {
  sectionId: string;
  onClose: () => void;
  onSuccess: () => void;  // Callback pour actualiser les chapitres
}

const ChapitreForm: React.FC<ChapitreFormProps> = ({ sectionId, onClose, onSuccess }) => {
  const [numero, setNumero] = useState('');
  const [nom, setNom] = useState('');
  const [prevision, setPrevision] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construire les données sans prévision si elle est vide
    const chapitreData: Record<string, any> = {
      sectionId,
      numero,
      nom,
    };

    if (prevision !== '') {
      chapitreData.prevision = Number(prevision);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/chapitre/createChapitre/${sectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chapitreData),
      });

      if (response.ok) {
        setMessage('Le chapitre a été créé avec succès.');
        setMessageType('success');
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Erreur lors de la création du chapitre. Veuillez réessayer.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erreur lors de la création du chapitre', error);
      setMessage('Erreur lors de la création du chapitre. Veuillez réessayer.');
      setMessageType('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Créer un Chapitre</h2>

        {message && (
          <div
            className={`text-center py-2 mb-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message}
          </div>
        )}

        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Numéro du chapitre</label>
          <input
            id="numero"
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom du chapitre</label>
          <input
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="prevision" className="block text-sm font-medium text-gray-700 mb-1">Prévision</label>
          <input
            id="prevision"
            type="number"
            value={prevision}
            onChange={(e) => setPrevision(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChapitreForm;
