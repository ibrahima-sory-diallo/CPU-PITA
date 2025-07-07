import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFolderPlus, FaUpload, FaFileAlt } from 'react-icons/fa';

interface FileWithNewName {
  file: File;
  newName: string;
}

const MultiFileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithNewName[]>([]);
  const [dossiersExistants, setDossiersExistants] = useState<string[]>([]);
  const [dossierSelectionne, setDossierSelectionne] = useState('');
  const [nouveauDossier, setNouveauDossier] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/archive/dossiers`)
      .then((res) => setDossiersExistants(res.data))
      .catch(() => setDossiersExistants([]));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files).map((file) => ({
      file,
      newName: file.name,
    }));
    setFiles(fileList);
  };

  const handleRenameChange = (index: number, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f, i) => (i === index ? { ...f, newName } : f))
    );
  };

  const handleUpload = async () => {
    const dossierFinal = nouveauDossier || dossierSelectionne;
    if (files.length === 0 || !dossierFinal) {
      setMessage('Veuillez choisir un dossier et au moins un fichier.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Envoi des fichiers un par un en parallèle
      const uploadPromises = files.map(({ file, newName }) => {
        const formData = new FormData();
        formData.append('dossier', dossierFinal);

        const fileToUpload =
          newName !== file.name
            ? new File([file], newName, { type: file.type })
            : file;

        formData.append('files', fileToUpload);

        return axios.post(
          `${import.meta.env.VITE_API_URL}/api/archive/upload-multiple`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      });

      await Promise.all(uploadPromises);

      setMessage(`✅ ${files.length} fichier(s) uploadé(s) avec succès.`);
      setIsSuccess(true);
      setFiles([]);
      setNouveauDossier('');
      setDossierSelectionne('');
    } catch (err) {
      console.error(err);
      setMessage("❌ Une erreur s'est produite lors de l'envoi des fichiers.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
        <FaUpload className="text-teal-700" /> Sauvegarde Multiple de Fichiers
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Dossier existant :
          </label>
          <select
            value={dossierSelectionne}
            onChange={(e) => setDossierSelectionne(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">-- Aucun --</option>
            {dossiersExistants.map((dossier) => (
              <option key={dossier} value={dossier}>
                {dossier}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className=" mb-1 text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaFolderPlus /> Nouveau dossier :
          </label>
          <input
            type="text"
            placeholder="Nom du dossier"
            value={nouveauDossier}
            onChange={(e) => setNouveauDossier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Sélectionner des fichiers :
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:font-semibold file:bg-blue-50 file:text-teal-700 hover:file:bg-blue-100"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Renommer les fichiers :</h3>
          {files.map(({ file, newName }, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 w-full sm:w-1/2">
                <FaFileAlt className="text-gray-500" />
                <span className="text-sm text-gray-600 truncate">{file.name}</span>
              </div>
              <input
                type="text"
                value={newName}
                onChange={(e) => handleRenameChange(index, e.target.value)}
                className="w-full sm:w-1/2 px-3 py-1 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-6 w-full flex justify-center items-center gap-2 bg-teal-700 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Chargement...' : <><FaUpload /> Ajouter les fichiers</>}
      </button>

      {message && (
        <div
          className={`mt-4 text-center text-sm px-4 py-2 rounded font-medium ${
            isSuccess === true
              ? 'text-green-700 bg-green-100 border border-green-300'
              : 'text-red-700 bg-red-100 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
