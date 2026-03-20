import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { HelmetProvider } from 'react-helmet-async'

import App from './App';

// Import du thème global — charge les CSS custom properties dans :root
import './styles/theme.module.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Élément #root introuvable dans le DOM');
}

createRoot(root).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);