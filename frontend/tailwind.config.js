/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'secondary': '#4f46e5',
        'accent': '#ec4899',
        'background': '#f1f5f9',
        'card': '#ffffff',
        'text': '#1e293b',
        'subtle': '#64748b',
        'gov-blue': '#003366',
        'gov-light-blue': '#0055AA',
        'gov-cream': '#F5F5DC',
        'gov-gold': '#FFD700',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.6)',
      },
    },
  },
  plugins: [],
}



