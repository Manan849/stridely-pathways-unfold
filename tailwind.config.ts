
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '900px'
      }
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        primary: "#000000",
        accent: "#007AFF",
        background: "#FFFFFF",
        section: "#F2F2F7",
      },
      boxShadow: {
        'card': '0 2px 24px 0 rgba(30,32,37,0.06), 0 1.5px 5px 0 rgba(0,0,0,0.04)',
        'modal': '0 12px 32px 0 rgba(20,20,30,0.13), 0 2px 6px 0 rgba(0,0,0,0.04)'
      },
      borderRadius: {
        'lg': '1.1rem',
        'xl': '2rem',
        'full': '9999px'
      },
      transitionProperty: {
        'button': 'background, box-shadow, color, border'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
