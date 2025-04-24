import { GET_USER } from "../components/Action/user.action";

// Définition des types pour le state et l'action
interface UserState {
  pseudo: string;
  uid: string | null;
}

interface Action {
  type: string;
  payload?: {
    pseudo: string;
    uid: string;
  };
}

// État initial
const initialState: UserState = {
  pseudo: "", 
  uid: null,  
};

export default function userReducer(state = initialState, action: Action): UserState {
  switch (action.type) {
    case GET_USER:
      // Vérification des données dans l'action et gestion de l'absence de payload
      return {
        ...state,
        pseudo: action.payload?.pseudo || "", 
        uid: action.payload?.uid || null,
      };

    default:
      return state;
  }
}
