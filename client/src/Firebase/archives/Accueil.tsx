import { useRef, useState } from "react";
import Swal from "sweetalert2";
import firebaseService from "../Firebase"

function Accueil() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE_IN_MB = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileSizeInMB = Number((files[0].size / 1048576).toFixed(2));
    if (fileSizeInMB >= MAX_FILE_SIZE_IN_MB) {
      Swal.fire({
        icon: "error",
        html: `Le fichier est trop gros (${fileSizeInMB} MB).<br>Taille maximale : ${MAX_FILE_SIZE_IN_MB} MB.`,
        title: "Une erreur est survenue",
      });
      return;
    }

    setFile(files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    if (!e.currentTarget.checkValidity()) {
      return;
    }

    try {
      const uniqueFilename = firebaseService.getUniquefilename(file);
      const uploadTask = firebaseService.uploadFile(file, uniqueFilename);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      });

      const id = await firebaseService.addFile(file.name, uniqueFilename);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      Swal.fire({
        footer: `<a href="/files/${id}">${id}</a>`,
        icon: "success",
        text: "Le fichier a été envoyé avec succès !",
        title: "C'est tout bon !",
      });
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      Swal.fire({
        icon: "error",
        text: "Une erreur est survenue lors de l'envoi du fichier.",
        title: "Erreur",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-4 px-6">
        <h2 className="text-lg font-semibold">Uploader un fichier</h2>
      </div>
      <div className="p-6">
        <form noValidate className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="file"
            required
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 file:text-sm file:font-semibold 
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 text-center">{uploadProgress}%</div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Obtenir un lien
          </button>
        </form>
      </div>
    </div>
  );
}

export default Accueil;
