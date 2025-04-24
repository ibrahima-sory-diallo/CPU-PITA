import { initializeApp } from "firebase/app";
import config from "./Config.json";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid"; // ✅ Import uuid

import {
  collection,
  CollectionReference,
  Firestore,
  getFirestore,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,

} from "firebase/firestore";

import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

import {
  FirebaseStorage,
  getStorage,
  uploadBytesResumable,
  UploadTask,
  ref,
} from "firebase/storage";

// Types
export type FileData = {
  id: string;
  originaleFilename: string;
  uniqueFilename: string;
  userId: string | null;
};

export type UserData = {
  displayName: string;
  uid: string;
};

class FirebaseService {
  auth: Auth;
  firestore: Firestore;
  filesCollection: CollectionReference<FileData>;
  usersCollection: CollectionReference<UserData>;
  googleAuthProvider: GoogleAuthProvider;
  storage: FirebaseStorage;
  nanoid: () => string;

  constructor() {
    initializeApp(config);
    this.auth = getAuth();
    this.auth.useDeviceLanguage();
    this.firestore = getFirestore();
    this.googleAuthProvider = new GoogleAuthProvider();
    this.storage = getStorage();
    this.nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

    this.usersCollection = collection(this.firestore, "users") as CollectionReference<UserData>;
    this.filesCollection = collection(this.firestore, "files") as CollectionReference<FileData>;
  }

  async addUser(user: User): Promise<void> {
    await setDoc(doc(this.usersCollection, user.uid), {
      uid: user.uid,
      displayName: user.displayName,
    });
  }

  async addFile(originaleFilename: string, uniqueFilename: string): Promise<string> {
    const userId = this.auth.currentUser ? this.auth.currentUser.uid : null;
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }
    const id = this.nanoid();
    await setDoc(doc(this.filesCollection, id), {
      id,
      originaleFilename,
      uniqueFilename,
      userId,
    });
    return id;
  }

  getUniquefilename(file: File): string {
    const fileExtension = file.name.split(".").pop();
    const uniqueName = `${uuidv4()}.${fileExtension}`;
    return uniqueName;
  }

  async getFileSentByCurrentUser(): Promise<FileData[]> {
    const files: FileData[] = [];
  
    const q = query(this.filesCollection, where("userId", "==", this.auth.currentUser?.uid));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach((docSnapshot) => {
      files.push(docSnapshot.data() as FileData);
    });
  
    return files;
  }
  


  async getSingleFile(id: string): Promise<FileData | null> {
    try {
      const fileDoc = await getDoc(doc(this.filesCollection, id));
      return fileDoc.exists() ? (fileDoc.data() as FileData) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du fichier :", error);
      return null;
    }
  }

  async getSingleUser(id: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, id));
      return userDoc.exists() ? (userDoc.data() as UserData) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return null;
    }
  }

  uploadFile(file: File, fileName: string): UploadTask {
    const storageRef = ref(this.storage, fileName);
    return uploadBytesResumable(storageRef, file);
  }

  async signInwithGoogle(): Promise<UserCredential | null> {
    try {
      const userCredential = await signInWithPopup(this.auth, this.googleAuthProvider);
      await this.addUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  }
}

export default new FirebaseService();
