import { GET_USER } from "../components/Action/user.action";


const initialState = {
  pseudo: "", // Initialiser un pseudo par défaut si nécessaire
  uid: null,  // ou tout autre champ que tu utilises
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        pseudo: action.payload.pseudo,
        uid: action.payload.uid,
      };

    default:
      return state;
  }
}
