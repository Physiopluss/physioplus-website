/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import defaultTheme from "tailwindcss/defaultTheme";
import lineClamp from "@tailwindcss/line-clamp";

export default withMT({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				green: "#039342",
				lightGreen: "#DFF1E7",
				black: "#2D3342",
			},
			fontFamily: {
				Urbanist: ['"Urbanist"', ...defaultTheme.fontFamily.sans],
				sans: ["Urbanist", "Open Sans", "sans-serif"],
				Oregano: ['"Oregano"', ...defaultTheme.fontFamily.sans],
			},
			animation: {
				scroll: "scroll 40s linear infinite",
				marquee: "marquee 25s linear infinite",
				marquee2: "marquee2 25s linear infinite",
			},
			keyframes: {
				scroll: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-50%)" },
				},
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				marquee2: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0%)" },
				},
			},
		},
	},
	plugins: [
		lineClamp,
		function ({ addComponents }) {
			addComponents({
				".strikethrough-diagonal": {
					position: "relative",
					"&:before": {
						position: "absolute",
						content: "''",
						left: "0",
						top: "45%",
						right: "0",
						borderTopWidth: "1px",
						borderColor: "currentColor",
						transform: "skewY(-10deg)",
					},
				},
			});
		},
	],
});
