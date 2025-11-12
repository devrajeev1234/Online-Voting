/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gov-blue': '#003366',
        'gov-light-blue': '#0055AA',
        'gov-cream': '#F5F5DC',
        'gov-gold': '#FFD700',
      },
    },
  },
  plugins: [],
}



