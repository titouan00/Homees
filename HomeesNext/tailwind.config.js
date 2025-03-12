/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-light": "#E3F2FD",
        "blue-medium": "#2196F3",
        "blue-dark": "#0D47A1",
        cyan: "#00BCD4",
      },
    },
  },
  plugins: [],
}

