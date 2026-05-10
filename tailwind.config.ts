import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071015",
        glass: "rgba(255,255,255,0.08)",
        line: "rgba(255,255,255,0.14)"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0,0,0,0.38)"
      },
      animation: {
        float: "float 8s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
