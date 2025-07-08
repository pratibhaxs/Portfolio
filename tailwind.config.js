module.exports = {
  darkMode: false, // Remove dark mode toggle, always use dark
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Indigo
        secondary: '#38BDF8', // Sky
        accent: '#FACC15', // Yellow
        background: '#111827', // Always dark bg
        gunmetal: '#F9FAFB', // Main text (light on dark)
        coolgray: '#A1A1AA', // Secondary text
      },
    },
  },
  plugins: [],
}; 