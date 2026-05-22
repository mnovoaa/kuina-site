import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#00060E",
        deep: "#000B1E",
        navy: "#001230",
        royal: "#002460",
        "kuina-blue": "#0A2FA0",
        electric: "#3355DD",
        celeste: "#4D6EF5",
        frost: "#EDE5CE",
        blood: "#9B0014",
        mustard: "#8B7020",
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        seal:    ["var(--font-pirata)", "serif"],
        serif:   ["var(--font-cormorant)", "serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
        script:  ["var(--font-dancing)", "cursive"],
      },
      keyframes: {
        cursorPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
        hopAcross: {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "0" },
          "5%": { opacity: "0.5" },
          "10%": { transform: "translateX(10vw) translateY(-15px)" },
          "20%": { transform: "translateX(20vw) translateY(0)" },
          "30%": { transform: "translateX(30vw) translateY(-15px)" },
          "40%": { transform: "translateX(40vw) translateY(0)" },
          "50%": { transform: "translateX(50vw) translateY(-15px)" },
          "60%": { transform: "translateX(60vw) translateY(0)" },
          "70%": { transform: "translateX(70vw) translateY(-15px)" },
          "80%": { transform: "translateX(80vw) translateY(0)" },
          "90%": { transform: "translateX(90vw) translateY(-15px)", opacity: "0.5" },
          "100%": { transform: "translateX(110vw) translateY(0)", opacity: "0" },
        },
        hopBackwards: {
          "0%": { transform: "translateX(0) scaleX(-1)", opacity: "0" },
          "5%": { opacity: "0.4" },
          "100%": { transform: "translateX(-110vw) scaleX(-1)", opacity: "0" },
        },
        glitch1: {
          "0%, 90%, 100%": { transform: "translate(0)", opacity: "0" },
          "92%": { transform: "translate(-3px, 2px)", opacity: "0.7" },
          "94%": { transform: "translate(2px, -1px)", opacity: "0.5" },
          "96%": { transform: "translate(0)", opacity: "0" },
        },
        glitch2: {
          "0%, 90%, 100%": { transform: "translate(0)", opacity: "0" },
          "93%": { transform: "translate(3px, -2px)", opacity: "0.5" },
          "95%": { transform: "translate(-2px, 1px)", opacity: "0.7" },
          "97%": { transform: "translate(0)", opacity: "0" },
        },
        scrollPulse: {
          "0%, 100%": { opacity: "0.3", transform: "scaleY(0.7)" },
          "50%": { opacity: "1", transform: "scaleY(1)" },
        },
        wave: {
          "0%, 100%": { height: "3px" },
          "50%": { height: "11px" },
        },
        float: {
          "0%": { transform: "translateY(100vh) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translateY(-10vh) translateX(40px)", opacity: "0" },
        },
        drawCastle: {
          to: { strokeDashoffset: "0" },
        },
        fadeInName: {
          to: { opacity: "1" },
        },
        heroFadeIn: {
          to: { opacity: "1" },
        },
        autoHideLoader: {
          "0%, 95%": { opacity: "1", visibility: "visible" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
      },
      animation: {
        cursorPulse: "cursorPulse 2s ease-in-out infinite",
        hopAcross: "hopAcross 18s linear infinite 3s",
        hopBackwards: "hopBackwards 25s linear infinite 8s",
        glitch1: "glitch1 4s infinite",
        glitch2: "glitch2 4s infinite",
        scrollPulse: "scrollPulse 2s ease-in-out infinite",
        wave: "wave 0.9s ease-in-out infinite",
        float: "float linear infinite",
        drawCastle: "drawCastle 2.5s ease forwards",
        fadeInName: "fadeInName 1s ease 1.8s forwards",
        heroFadeIn: "heroFadeIn 1.2s ease 0.3s forwards",
        heroFadeInSlow: "heroFadeIn 1.5s ease 0.6s forwards",
        heroFadeInSlower: "heroFadeIn 1.5s ease 1.2s forwards",
        heroFadeInMeta: "heroFadeIn 1s ease 2s forwards",
        autoHideLoader: "autoHideLoader 4s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
