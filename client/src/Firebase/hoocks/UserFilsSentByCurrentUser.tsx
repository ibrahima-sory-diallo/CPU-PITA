import { useContext, useEffect, useState } from "react";

import firebaseService, { FileData } from "../Firebase";
import { AuthContext } from "../../components/AuthContext";
import { User } from "firebase/auth";

export type UserSentByCurrentUser = {
  currentUser: User
  files: FileData[];
};

export const userSentByCurrentUser = (): UserSentByCurrentUser => {
  const { currentUser } = useContext(AuthContext);
  const [files, setFile] = useState<FileData[]>([]);

  const fetchData = async () => {
    if (currentUser) {
      const data = await firebaseService.getFileSentByCurrentUser();
      setFile(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.uid]);

  return { currentUser, files };
};
