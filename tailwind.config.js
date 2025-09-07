/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 86%, 40%)',
        accent: 'hsl(140, 56%, 45%)',
        bg: 'hsl(220, 16%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(0, 0%, 0%, 0.08)',
        'modal': '0 18px 48px hsla(0, 0%, 0%, 0.24)',
      },
      animation: {
        'fast': '100ms ease-out',
        'base': '200ms ease-out',
        'slow': '400ms ease-out',
      },
      maxWidth: {
        'container': '72rem',
      }
    },
  },
  plugins: [],
}