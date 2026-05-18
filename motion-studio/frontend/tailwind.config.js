/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#0f0f13',
          panel: '#1a1a22',
          border: '#2a2a38',
          accent: '#6366f1',
          accent2: '#a855f7',
          text: '#e2e2f0',
          muted: '#6b6b8a',
        },
      },
    },
  },
  plugins: [],
};
