import React, { useState, useEffect } from 'react';

interface Paragraphe {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  encours: number;
}

interface Props {
  paragraphe: Paragraphe | null;
  onClose: () => void;
  onSave: (updated: Paragraphe) => Promise<boolean>; // onSave retourne un booléen de succès
}

const ModalEditParagraphe: React.FC<Props> = ({ paragraphe, onClose, onSave }) => {
  const [formData, setFormData] = useState<Paragraphe | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paragraphe) {
      setFormData({
        ...paragraphe,
        realisation: paragraphe.realisation ?? 0,
        taux: paragraphe.taux ?? 0,
        encours: paragraphe.encours ?? 0,
      });
    }
  }, [paragraphe]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: name === 'numero' || name === 'prevision' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      const success = await onSave({ ...formData });
      if (success) {
        setMessage("Paragraphe mis à jour avec succès !");
        setError(null);
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 1500);
      } else {
        setError("Échec de la mise à jour.");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">Modifier Paragraphe</h2>

        {message && <div className="mb-2 text-green-600">{message}</div>}
        {error && <div className="mb-2 text-red-600">{error}</div>}

        <input
          className="w-full p-2 mb-2 border"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Numero"
        />
        <input
          className="w-full p-2 mb-2 border"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom"
        />
        <input
          className="w-full p-2 mb-2 border"
          name="prevision"
          type="number"
          value={formData.prevision}
          onChange={handleChange}
          placeholder="Prévision"
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Annuler</button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded" onClick={handleSubmit}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditParagraphe;
