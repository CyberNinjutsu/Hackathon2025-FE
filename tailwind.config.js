// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ffb2",
        dark: {
          bg: "#08070e",
          card: "#17171d"
        },
        border: "#202026",
        text: {
          primary: "#f5f5f5",
          secondary: "#d5d5d5",
          dark: "#000"
        },
        danger: "#f06"
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"]
      },
      backgroundImage: {
        "glow-top":
          "radial-gradient(circle 800px at top -20% left -10%, rgba(0, 255, 178, 0.08), transparent 70%)",
        "glow-bottom":
          "radial-gradient(circle 600px at bottom -15% right -10%, rgba(0, 255, 178, 0.06), transparent 80%)"
      }
    }
  },
  plugins: []
}
