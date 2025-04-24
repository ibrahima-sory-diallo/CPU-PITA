import React, { useState } from 'react';

interface ModalArticleProps {
  chapitreId: string;  // ID du chapitre pour l'API
  onClose: () => void; // Fonction pour fermer le modal
  onSuccess?: () => void;
}

const ModalArticle: React.FC<ModalArticleProps> = ({ chapitreId, onClose, onSuccess }) => {
  const [numero, setNumero] = useState<string>(''); // Pour le numéro de l'article
  const [nom, setNom] = useState<string>(''); // Pour le nom de l'article
  const [loading, setLoading] = useState<boolean>(false); // Pour gérer l'état de chargement
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs

  // Fonction pour envoyer les données de l'article à l'API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Activer le chargement
    setError(null); // Réinitialiser les erreurs

    // Validation des données
    if (!numero || !nom) {
      setError('Tous les champs doivent être remplis.');
      setLoading(false);
      return;
    }

    const articleData = {
      numero: parseInt(numero, 10), // Convertir le numéro en entier
      nom,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/article/createArticle/${chapitreId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData), // Envoi des données sous forme JSON
      });

      const data = await response.json(); // Lecture de la réponse

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de l\'article');
      }

      console.log('Article ajouté avec succès', data);
      onSuccess?.()
      onClose(); // Fermer le modal après l'ajout
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la requête:', error);
      setError(error.message); // Afficher le message d'erreur
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ajouter un article</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>} {/* Affichage des erreurs */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Numéro</label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Numéro de l'article"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nom de l'article"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
              disabled={loading} // Désactiver le bouton si en cours de soumission
            >
              {loading ? 'Envoi...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalArticle;
