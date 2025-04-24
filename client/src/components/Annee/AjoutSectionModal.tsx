import React from 'react';

interface AjoutSectionModalProps {
  nomSection: string;
  titreSection: string;
  setNomSection: (value: string) => void;
  setTitreSection: (value: string) => void;
  ajouterSection: () => void;
  onClose: () => void;
}

const AjoutSectionModal: React.FC<AjoutSectionModalProps> = ({
  nomSection,
  titreSection,
  setNomSection,
  setTitreSection,
  ajouterSection,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ajouter une Section</h2>
        <input
          type="text"
          placeholder="Nom de la section"
          value={nomSection}
          onChange={(e) => setNomSection(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Titre de la section"
          value={titreSection}
          onChange={(e) => setTitreSection(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={ajouterSection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ajouter
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default AjoutSectionModal;
