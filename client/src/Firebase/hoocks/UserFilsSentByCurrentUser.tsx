import { useContext, useEffect, useState } from "react";
import firebaseService, { FileData } from "../Firebase";
import { AuthContext } from "../../components/AuthContext";
import { User } from "firebase/auth";

export type UserSentByCurrentUser = {
  currentUser: User | null;
  files: FileData[];
};

export const useUserSentByCurrentUser = (): UserSentByCurrentUser => {
  const context = useContext(AuthContext);
  const currentUser = context?.currentUser ?? null;
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const data = await firebaseService.getFileSentByCurrentUser();
        setFiles(data);
      }
    };

    fetchData();
  }, [currentUser?.uid]);

  return { currentUser, files };
};
