import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../Store/Store"; // Remplace par ton vrai fichier store
import axios from "axios";

export const GET_USER = "GET_USER";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface GetUserAction {
  type: typeof GET_USER;
  payload: User;
}

export type UserActionTypes = GetUserAction;

// ✅ Fonction avec bon typage
export const getUser = (
  uid: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}api/user/${uid}`);
      dispatch({ type: GET_USER, payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };
};
