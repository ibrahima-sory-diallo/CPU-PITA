import axios from "axios";

// Typage pour la réponse de l'API
interface User {
  id: string;
  name: string;
  email: string;
  // Ajoute d'autres champs que tu attends de l'API
}

// Types d'actions Redux
export const GET_USER = 'GET_USER';

interface GetUserAction {
  type: typeof GET_USER;
  payload: User;
}

// Action Creator
export const getUser = (uid: string) => {
  return (dispatch: React.Dispatch<GetUserAction>) => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}api/user/${uid}`)
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
        // Ici, tu pourrais ajouter une action pour gérer les erreurs
      });
  };
};
