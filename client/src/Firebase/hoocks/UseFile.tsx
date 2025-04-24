import { useEffect, useState } from "react";
import { ref, getMetadata, FullMetadata, getStorage } from "firebase/storage";
import { DocumentData } from "firebase/firestore";
import firebaseService from "../Firebase"; // ton service avec les méthodes getSingleFile & getSingleUser
import { FileData } from "../Firebase"; // <-- Assure-toi d'importer un vrai type ici

export type UseFileData = {
  error: boolean;
  file: FileData | null;
  loading: boolean;
  metadata: FullMetadata | null;
  owner: DocumentData | null;
};

export const useFile = (id: string): UseFileData => {
  const [error, setError] = useState(false);
  const [file, setFile] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<FullMetadata | null>(null);
  const [owner, setOwner] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileData = await firebaseService.getSingleFile(id);
        if (!fileData) throw new Error("Fichier introuvable");

        setFile(fileData);

        const storage = getStorage();
        const storageRef = ref(storage, fileData.uniqueFilename);
        const meta = await getMetadata(storageRef);
        setMetadata(meta);

        if (fileData.userId) {
          const user = await firebaseService.getSingleUser(fileData.userId);
          setOwner(user);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du fichier :", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { error, file, loading, metadata, owner };
};
