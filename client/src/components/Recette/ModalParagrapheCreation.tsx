import React, { useState } from 'react';

interface ModalParagrapheCreationProps {
  paragrapheMerId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalParagrapheCreation: React.FC<ModalParagrapheCreationProps> = ({
  paragrapheMerId,
  onClose,
  onSuccess,
}) => {
  const [nom, setNom] = useState('');
  const [numero, setNumero] = useState<number | undefined>(undefined);
  const [prevision, setPrevision] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!nom || numero === undefined || numero <= 0) {
      setError('Le nom et le numéro sont obligatoires.');
      setSuccessMessage(null);
      return;
    }

    const newParagraphe: any = {
      nom,
      numero,
    };

    if (prevision !== undefined && prevision > 0) {
      newParagraphe.prevision = prevision;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/paragraphe/createParagraphe/${paragrapheMerId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newParagraphe),
        }
      );

      if (response.ok) {
        setSuccessMessage('Sous-Paragraphe créé avec succès!');
        setError(null);
        setNom('');
        setNumero(undefined);
        setPrevision(undefined);
        onSuccess?.();
      } else {
        setError('Erreur lors de la création du paragraphe.');
        setSuccessMessage(null);
      }
    } catch (error) {
      setError('Erreur réseau. Veuillez réessayer.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Créer un Sous-Paragraphe</h2>

        {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="mb-4">
          <label>Numéro :</label>
          <input
            type="number"
            className="border w-full p-2"
            value={numero !== undefined ? numero : ''}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setNumero(isNaN(value) || value <= 0 ? undefined : value);
            }}
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
            placeholder="Entrez le nom du sous-paragraphe"
          />
        </div>

        <div className="mb-4">
          <label>Prévision :</label>
          <input
            type="number"
            className="border w-full p-2"
            value={prevision !== undefined ? prevision : ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setPrevision(isNaN(value) || value < 0 ? undefined : value);
            }}
            placeholder="Entrez la prévision"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-500 text-white rounded-md">
            Annuler
          </button>
          <button onClick={handleSave} className="p-2 bg-teal-500 text-white rounded-md">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
