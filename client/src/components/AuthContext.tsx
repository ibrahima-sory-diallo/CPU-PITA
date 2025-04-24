import { createContext, useEffect, useState, ReactNode } from "react";
import firebaseService from "../Firebase/Firebase";

export const AuthContext = createContext<{
    currentUser: any;
    isLoaded: boolean;
} | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = firebaseService.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setIsLoaded(true);
        });
        

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};
