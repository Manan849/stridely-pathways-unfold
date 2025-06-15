
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
        sfpro: ['"SF Pro Display"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        primary: "#1D1D1F",          // Apple black
        accent: "#0071e3",           // Apple System Blue
        blue: "#0071e3",             // For variant usages
        background: "#FFFFFF",
        section: "#F5F5F7",          // Apple section bg
        gray: {
          50:  "#f9f9fa",
          100: "#f2f2f7",
          200: "#ebebf0",
          300: "#e4e4ea",
          400: "#d1d1d6",
          500: "#aeaeb2",
          600: "#86868b",            // Apple dark gray
          700: "#6e6e73",            // Apple darker gray
          800: "#48484a",
          900: "#1d1d1f"
        }
      },
      boxShadow: {
        'card': '0 4px 12px 0 rgba(24,28,31,0.08), 0 1.5px 5px 0 rgba(0,0,0,0.05)',
        'modal': '0 16px 36px 0 rgba(20,20,30,0.10), 0 2px 8px 0 rgba(0,0,0,0.03)'
      },
      borderRadius: {
        'lg': '1.25rem',             // 20px for more Apple feel
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
