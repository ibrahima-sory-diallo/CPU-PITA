import  { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFile } from '../hoocks/UseFile'
import { getStorage, ref, getBlob } from 'firebase/storage'

function Files() {
  const params = useParams()
  const [downLoading, setDownLoading] = useState<boolean>(false)
  const { error, file, loading, owner } = useFile(params.id || '')

  const handleDownload = async () => {
    if (!file) return

    setDownLoading(true)
    try {
      const blob = await getBlob(ref(getStorage(), file.uniqueFilename))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.originaleFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Erreur lors du téléchargement :", err)
    } finally {
      setDownLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      {error ? (
        <div className="bg-red-100 text-red-800 font-semibold border border-red-300 p-4 rounded mb-4">
          Une erreur s'est produite !
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
      ) : (
        file && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="text-xl font-semibold mb-4">
              {file.originaleFilename}
            </div>
            <button
              onClick={handleDownload}
              disabled={downLoading}
              className={`w-full py-2 px-4 rounded mb-3 font-medium transition-colors ${
                downLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {downLoading ? 'Téléchargement en cours...' : 'Télécharger'}
            </button>
            <div className="text-sm text-gray-600">
              Partagé par {owner ? owner.displayName : "un utilisateur anonyme"}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Files
