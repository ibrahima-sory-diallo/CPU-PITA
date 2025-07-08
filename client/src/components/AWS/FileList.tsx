import React, { useEffect, useState } from 'react';

// Types
type Fichier = {
  fileName: string;
  size: number;
  lastModified: string;
};

type Dossier = {
  dossier: string;
  fichiers: Fichier[];
};

const FileList: React.FC = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDossier, setExpandedDossier] = useState<string | null>(null);

  const [fichiersEnCours, setFichiersEnCours] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/archive/dossiersFile`)
      .then(res => res.json())
      .then((data: Dossier[]) => {
        setDossiers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erreur lors de la récupération des dossiers");
        setLoading(false);
      });
  }, []);

  const toggleDossier = (dossier: string) => {
    setExpandedDossier(prev => (prev === dossier ? null : dossier));
  };

  const handleDownload = async (filePath: string) => {
    try {
      setFichiersEnCours(prev => ({ ...prev, [filePath]: true }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/archive/get-signed-url?fileName=${filePath}`);
      const data = await response.json();

      if (response.ok) {
        const blob = await (await fetch(data.signedUrl)).blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filePath.split('/').pop() || 'fichier';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("Erreur URL signée :", data.error);
      }
    } catch (e) {
      console.error("Erreur téléchargement :", e);
    } finally {
      setFichiersEnCours(prev => ({ ...prev, [filePath]: false }));
    }
  };

  
  if (loading) return <div className="text-center mt-6 text-gray-500">Chargement...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📁 Liste des Dossiers</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un fichier..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border rounded shadow-sm"
      />

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600">📅 Date min</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">📅 Date max</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
        </div>
      </div>

      {dossiers.map((dossier, index) => (
        <div key={index} className="mb-6 border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md">
          <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleDossier(dossier.dossier)}>
            <h3 className="text-xl font-semibold text-teal-700">
              {expandedDossier === dossier.dossier ? '📁 ' : '📁 '} {dossier.dossier}
            </h3>
            <span className="text-sm bg-blue-100 text-green-700 px-2 py-1 rounded-full">
              {dossier.fichiers.length} fichier{dossier.fichiers.length > 1 ? 's' : ''}
            </span>
          </div>

          {expandedDossier === dossier.dossier && (
            <ul className="space-y-4">
              {dossier.fichiers
                .filter(f => f.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((file, idx) => {
                  const filePath = `${dossier.dossier}/${file.fileName}`;
                  const isDownloading = fichiersEnCours[filePath];

                  // Nettoyer le nom du fichier (enlever le timestamp)
                  const cleanFileName = file.fileName.replace(/^\d+-/, '');

                  return (
                    <li key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-2 hover:bg-gray-100 hover:border-gray-300">
                      <div>
                        <div className="font-medium text-gray-800">
                          {cleanFileName}
                        </div>

                        <div className="text-sm text-gray-500">Taille : {file.size} octets</div>
                        <div className="text-sm text-gray-500">Dernière modification : {new Date(file.lastModified).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-3 mt-2 md:mt-0">
                        <button className="text-blue-600 hover:underline" onClick={() => handleDownload(filePath)} disabled={isDownloading}>
                          {isDownloading ? (
                            <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                            </svg>
                          ) : (
                            <>Télécharger →</>
                          )}
                        </button>
                      </div>

                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;
