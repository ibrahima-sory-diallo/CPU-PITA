import React, { useState } from 'react';

interface CreateParagrapheFormProps {
  selectedChapitreId: string | null;
  fetchParagraphes: (chapitreId: string) => void;
  onClose: () => void;
}

export const CreateParagrapheForm: React.FC<CreateParagrapheFormProps> = ({
  selectedChapitreId,
  fetchParagraphes,
  onClose
}) => {
  const [newParagraphe, setNewParagraphe] = useState({
    nom: '',
    prevision: 0,
    emission: 0,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewParagraphe({
      ...newParagraphe,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateParagraphe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapitreId) return;

    try {
      // Envoi de la requête pour créer un paragraphe
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/paragraphe/createParagraphe/${selectedChapitreId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParagraphe),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paragraphe');
      }

      // Si la création réussit, rechargez les paragraphes et fermez le formulaire;
      alert('Paragraphe créé avec succès');
      fetchParagraphes(selectedChapitreId);  // Recharger les paragraphes
      onClose();  // Fermer le formulaire après la création
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du paragraphe');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-4">Créer un Paragraphe</h3>
      <form onSubmit={handleCreateParagraphe}>
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du Paragraphe</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={newParagraphe.nom}
            onChange={handleFormChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="prevision" className="block text-sm font-medium text-gray-700">Prévision</label>
          <input
            type="number"
            id="prevision"
            name="prevision"
            value={newParagraphe.prevision}
            onChange={handleFormChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Créer Paragraphe
          </button>
        </div>
      </form>
      <button
        onClick={onClose}
        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Annuler
      </button>
    </div>
  );
};
