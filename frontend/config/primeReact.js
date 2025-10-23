// Configuración de PrimeReact para mejor rendimiento
import { PrimeReactProvider } from 'primereact/api';

// Configuración global de PrimeReact
const primeReactConfig = {
  ripple: true,
  inputStyle: 'outlined',
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100
  }
};

export { primeReactConfig };
