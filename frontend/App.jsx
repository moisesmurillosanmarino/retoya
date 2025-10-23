import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Layout from './components/Layout.jsx';
import AppRoutes from './app/routes.jsx';
import './app/styles/index.css';

// Configuración simple de PrimeReact
const primeReactConfig = {
  ripple: true,
  inputStyle: 'outlined'
};

export default function App() {
  return (
    <PrimeReactProvider value={primeReactConfig}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

