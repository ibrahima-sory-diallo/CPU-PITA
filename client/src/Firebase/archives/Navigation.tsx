import { useContext, useState } from 'react';
import { AuthContext } from '../../components/AuthContext';
import firebaseService from "../Firebase";
import Accueil from './Accueil';
import FilleEnvoi from './FilleEnvoi';
import FileSent from './FileSent';

type ViewType = 'accueil' | 'fichiers' | 'envoyes' | null;

function Navigation() {
  const context = useContext(AuthContext);

  if (!context) {
    return <div>Chargement...</div>; // Ou un spinner, ou null
  }

  const { currentUser, isLoaded } = context;
  const [view, setView] = useState<ViewType>(null);

  return (
    <>
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simple Transfer</h1>
          <div className="space-x-4 flex items-center">
            <button 
              className="hover:underline hover:text-gray-200"
              onClick={() => setView('accueil')}
            >
              Accueil
            </button>
            <button 
              className="hover:underline hover:text-gray-200"
              onClick={() => setView('fichiers')}
            >
              Fichiers
            </button>
            <button 
              className="hover:underline hover:text-gray-200"
              onClick={() => setView('envoyes')}
            >
              Fichiers envoyés
            </button>

            <div className={isLoaded ? '' : 'hidden'}>
              {currentUser ? (
                <button 
                  className='bg-red-700 rounded-md p-2 ml-4' 
                  onClick={async () => await firebaseService.signOut()}
                >
                  Se déconnecter
                </button>
              ) : (
                <button 
                  className='bg-blue-800 rounded-md p-2 ml-4' 
                  onClick={async () => await firebaseService.signInwithGoogle()}
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="mt-10 px-6">
        {view === 'accueil' && <Accueil />}
        {view === 'fichiers' && <FilleEnvoi />}
        {view === 'envoyes' && <FileSent />}
      </div>
    </>
  );
}

export default Navigation;
