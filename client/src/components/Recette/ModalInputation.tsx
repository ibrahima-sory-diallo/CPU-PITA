import React, { useState } from 'react';
import { InputationsList } from './InputationsList';
import { CreateInputationForm } from './CreateInputationForm';

interface Inputation {
  _id: string;
  numero: number;
  date: string;
  mdt: string;
  beneficiaire: string;
  montant: number;
  montantCumulle:number;
  observation: string;
}

interface Paragraphe {
  _id: string;
  numero: number;
  nom: string;
  prevision: number;
  realisation: number;
  taux: number;
  encours:number
}

interface ModalInputationProps {
  paragraphe: Paragraphe | null;
  onClose: () => void;
}

export const ModalInputation: React.FC<ModalInputationProps> = ({ paragraphe, onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInputations, setShowInputations] = useState(false);
  const [inputations, setInputations] = useState<Inputation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!paragraphe) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-md w-1/2 modal-content m-2">
          <p>Chargement du paragraphe...</p>
          <button className="mt-4 bg-red-500 text-white p-2" onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  const fetchInputations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/inputation/getInputations/${paragraphe._id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des imputations');
      }
      const data = await response.json();
      setInputations(data.inputations || []);
    } catch (error) {
      setError('Erreur lors de la récupération des imputations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInputation = (newInputation: Inputation) => {
    setInputations((prev) => [...prev, newInputation]);
    setShowCreateForm(false);
    setShowInputations(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md w-1/2 modal-content m-2">
        <div className='flex mx-4'>
        <h2 className="text-xl font-bold mx-2">{paragraphe.nom}</h2>
        <p className='mx-2'><strong>Numéro:</strong> {paragraphe.numero}</p>
        <p className='mx-2'><strong>Prévision:</strong> {paragraphe.prevision}</p>
        </div>

        <div className="mt-4">
          <button
            className="bg-teal-700 text-white p-2 mr-2 rounded-md"
            onClick={() => {
              setShowCreateForm(true);
              setShowInputations(false);
            }}
          >
            Créer Inputation
          </button>
          <button
            className="bg-teal-500 text-white p-2 rounded-md"
            onClick={() => {
              fetchInputations();
              setShowCreateForm(false);
              setShowInputations(true);
            }}
          >
            Voir Inputations
          </button>
        </div>

        {showCreateForm && (
          <div className="mt-4">
            <CreateInputationForm
              onCreate={handleCreateInputation}
              onCancel={() => setShowCreateForm(false)}
              paragrapheId={paragraphe._id}
            />
          </div>
        )}

        {showInputations && (
          <div className="mt-4">
            <button
              className="bg-red-500 text-white p-2 mb-4 rounded-md"
              onClick={() => setShowInputations(false)}
            >
              Retour
            </button>
            {loading && (
              <div className="mt-4">
                <p>Chargement des imputations...</p>
                <progress className="w-full" value="0" max="100" />
              </div>
            )}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {inputations.length > 0 ? (
              <InputationsList
               inputations={inputations} 
               paragrapheNom={paragraphe.nom} 
               onRefresh={fetchInputations}
               />
            ) : (
              <div className="text-center">Aucune imputation trouvée</div>
            )}
          </div>
        )}

        <button className="mt-4 bg-red-600 text-white p-2 rounded-sm" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};
