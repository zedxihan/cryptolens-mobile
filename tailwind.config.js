/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        pregular: ['Poppins_400Regular'],
        pmedium: ['Poppins_500Medium'],
        psemibold: ['Poppins_600SemiBold'],
        pbold: ['Poppins_700Bold'],
      },
      colors: {
        bg: '#060c0a',
        surface: '#030805',
        'surface-2': '#0e0e0e',
        sidebar: '#010201',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-2': 'rgba(255, 255, 255, 0.04)',
        text: '#d8f1e7',
        muted: '#86a79b',
        'muted-2': '#5f7d73',
        accent: '#29d18b',
        'accent-2': '#18a76d',
        'price-green': '#00a83e',
        'price-red': '#ff3a33',
      },
    },
  },
  plugins: [],
};
