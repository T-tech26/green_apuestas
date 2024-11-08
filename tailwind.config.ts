import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'dark-gradient-180deg': 'linear-gradient(180deg, #281A3A 0%, #4E5275 100%)',
  			'dark-gradient-180deg-reverse': 'linear-gradient(180deg, #4E5275 0%, #281A3A 100%)',
  			'light-gradient-180deg': 'linear-gradient(180deg, #1089FF 0%, #A2CDF6 100%)',
  			'light-gradient-180deg-reverse': 'linear-gradient(180deg, #A2CDF6 0%, #1089FF 100%)',
  			'dark-gradient-135deg': 'linear-gradient(135deg, #281A3A 0%, #4E5275 100%)',
  			'light-gradient-135deg': 'linear-gradient(135deg, #1089FF 0%, #A2CDF6 100%)'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			'color-60': '#281A3A',
  			'color-30': '#F6F4F1',
  			'color-10': '#1089FF'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
