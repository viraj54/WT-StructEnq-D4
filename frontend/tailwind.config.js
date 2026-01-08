/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a', // Dark Blue
        secondary: '#f8fafc', // Light Gray
        accent: '#10b981', // Green
        danger: '#ef4444', // Red
      }
    },
  },
  plugins: [],
}
