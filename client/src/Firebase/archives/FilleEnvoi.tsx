import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFile } from '../hoocks/UseFile'
import { getStorage, ref, getBlob } from 'firebase/storage'

function FilleEnvoi() {
  const { id } = useParams()
  const [downloading, setDownloading] = useState(false)

  // On ne charge le hook que si l'ID est défini et non vide
  const { error, file, loading, owner } = useFile(id || 'invalid')

  const handleDownload = async () => {
    if (!file) return

    setDownloading(true)
    try {
      const blob = await getBlob(ref(getStorage(), file.uniqueFilename))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.originaleFilename || 'document'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erreur lors du téléchargement :', err)
      alert("Impossible de télécharger le fichier.")
    } finally {
      setDownloading(false)
    }
  }

  if (!id) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-red-600 font-semibold">
        L'identifiant du fichier est invalide ou manquant.
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      {error ? (
        <div className="bg-red-100 text-red-800 font-semibold border border-red-300 p-4 rounded mb-4">
          Une erreur s'est produite.
        </div>
      ) : loading ? (
        <div className="bg-white shadow-md rounded p-6 flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      ) : file ? (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-xl font-semibold mb-4">
            {file.originaleFilename}
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full py-2 px-4 rounded mb-3 font-medium transition-colors ${
              downloading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {downloading ? 'Téléchargement en cours...' : 'Télécharger'}
          </button>
          <div className="text-sm text-gray-600">
            Partagé par {owner?.displayName || 'un utilisateur anonyme'}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">Aucun fichier trouvé.</div>
      )}
    </div>
  )
}

export default FilleEnvoi
