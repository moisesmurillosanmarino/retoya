import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const mount = document.getElementById('root');
if (mount) {
  const root = createRoot(mount);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

