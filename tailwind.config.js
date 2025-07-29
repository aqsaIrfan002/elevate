// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default { // Use 'export default' for ES module syntax if your project prefers it
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add any other paths where your Tailwind classes are used
  ],
  theme: {
    extend: {
      fontFamily: {
        'dmsans': ['"DM Sans"', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'], 
      },
    },
  },
  plugins: [],
}