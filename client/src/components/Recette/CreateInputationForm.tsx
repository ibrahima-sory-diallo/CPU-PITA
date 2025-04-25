import React, { useState } from 'react';

interface CreateInputationFormProps {
  onCreate: (newInputation: any) => void;
  onCancel: () => void;
  paragrapheId: string;
}

export const CreateInputationForm: React.FC<CreateInputationFormProps> = ({ onCreate, onCancel, paragrapheId }) => {
  const [formData, setFormData] = useState({
    numero: '',
    date: '',
    mdt: '',
    beneficiaire: '',
    montant: '',
    livre: '',
    observation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inputation/createInputation/${paragrapheId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'imputation');
      }

      const data = await response.json();
      onCreate(data.inputation); // On envoie la nouvelle imputation au parent
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <input name="numero" placeholder="Numéro" value={formData.numero} onChange={handleChange} className="border p-2 w-full" />
      <input name="date" type="date" placeholder="Date" value={formData.date} onChange={handleChange} className="border p-2 w-full" />
      <input name="mdt" placeholder="MDT" value={formData.mdt} onChange={handleChange} className="border p-2 w-full" />
      <input name="beneficiaire" placeholder="Bénéficiaire" value={formData.beneficiaire} onChange={handleChange} className="border p-2 w-full" />
      <input name="montant" type="number" placeholder="Montant" value={formData.montant} onChange={handleChange} className="border p-2 w-full" />
      <input name="livre" placeholder="Livre" value={formData.livre} onChange={handleChange} className="border p-2 w-full" />

      <div className="flex justify-between mt-4">
        <button type="submit" className="bg-teal-700 text-white p-2 rounded-md" disabled={loading}>
          {loading ? 'Création en cours...' : 'Valider'}
        </button>
        <button type="button" className="bg-red-500 text-white p-2 rounded-md" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
};
