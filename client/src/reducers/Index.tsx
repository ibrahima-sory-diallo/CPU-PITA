// reducers/index.js
import { combineReducers } from "redux";
import userReducer from "./Users.reducers";


export default combineReducers({
  user: userReducer, // Change ici : le nom de la clé sera 'user'

});
