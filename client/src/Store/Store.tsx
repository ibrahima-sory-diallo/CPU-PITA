// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/Users.reducers';


const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: true,
});

// Pour bénéficier de l'autocompletion dans useSelector, exporte le type RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
