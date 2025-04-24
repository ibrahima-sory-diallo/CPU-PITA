import { createRoot } from 'react-dom/client';
import './index.css'; 
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./Store/Store.tsx"
// Rendre l'application dans le DOM
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
