/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.jsx',
    './main.jsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};

