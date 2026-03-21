/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'auth-gradient': 'linear-gradient(135deg, #f0f4f8 0%, #e8e4f0 40%, #f5f0e8 100%)',
      },
      colors: {
        primary: {
          DEFAULT: "#0e1c2b",
          50: "#f0f4f8",
          100: "#d6e4f9",
          200: "#bac8dc",
          300: "#8b99ac",
          400: "#525f71",
          500: "#3a4859",
          600: "#233141",
          700: "#1a2535",
          800: "#111d2c",
          900: "#0e1c2b",
        },
        secondary: {
          DEFAULT: "#775a19",
          50: "#fdf8ee",
          100: "#ffdea5",
          200: "#fed488",
          300: "#e9c176",
          400: "#c9a44a",
          500: "#775a19",
          600: "#5d4201",
          700: "#4a3400",
          800: "#382700",
          900: "#261900",
        },
        surface: {
          DEFAULT: "#fbf8ff",
          dim: "#d7d8f4",
          bright: "#fbf8ff",
        },
        gold: {
          DEFAULT: "#e9c176",
          light: "#fed488",
          dark: "#775a19",
        }
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        serif: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}