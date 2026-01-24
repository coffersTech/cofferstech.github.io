import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#00FF00", // Neon Green
                "accent-blue": "#00f0ff",
                "background-light": "#f5f8f5",
                "background-dark": "#0A0A0A", // Terminal Black
                "terminal-grey": "#E0E0E0",
                'brand-green': '#00FF00',
                'brand-black': '#0A0A0A',
            },
            fontFamily: {
                "display": ["var(--font-space-grotesk)", "var(--font-noto-sans-sc)", "monospace"],
                "mono": ["var(--font-roboto-mono)", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;