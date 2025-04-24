import React, { useState } from 'react';

interface ModalParagrapheMerCreationProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalParagrapheMerCreation: React.FC<ModalParagrapheMerCreationProps> = ({ articleId, onClose, onSuccess }) => {
  const [nom, setNom] = useState('');
  const [numero, setNumero] = useState<number | undefined>(undefined); // Initialisation avec undefined
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nom || numero === undefined || numero <= 0) { // Vérification que 'numero' n'est pas undefined et est valide
      setError('Veuillez remplir tous les champs correctement.');
      setSuccessMessage(null);
      return;
    }

    const newParagraphe = { nom, numero };

    try {
      if (!articleId) {
        console.error("Aucun articleId fourni à la modale");
        return;
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/paragrapheMer/createParagrapheMer/${articleId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newParagraphe),
        }
      );

      if (response.ok) {
        setSuccessMessage('ParagrapheMer créé avec succès!');
        setNom('');
        setNumero(undefined); // Remise à zéro de 'numero' après la création
        setError(null);
        onSuccess?.();
      } else {
        setError('Erreur lors de la création du paragrapheMer.');
        setSuccessMessage(null);
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez réessayer.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Créer un Paragraphe</h2>

        {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="mb-4">
          <label>Numéro :</label>
          <input
            type="number"
            className="border w-full p-2"
            value={numero !== undefined ? numero : ''} // Affichage vide si 'numero' est undefined
            onChange={(e) => setNumero(parseInt(e.target.value) || undefined)} // Éviter l'insertion de NaN
            placeholder="Entrez le numéro"
          />
        </div>

        <div className="mb-4">
          <label>Nom :</label>
          <input
            type="text"
            className="border w-full p-2"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Entrez le nom du paragraphe"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-500 text-white rounded-md">Quitter</button>
          <button onClick={handleSave} className="p-2 bg-teal-500 text-white rounded-md">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};
