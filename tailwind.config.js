/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			// 「参考になった」を押せたときの演出（ReactionButton）
  			'reaction-pop': {
  				'0%': { transform: 'scale(1) rotate(0)' },
  				'35%': { transform: 'scale(1.45) rotate(-14deg)' },
  				'65%': { transform: 'scale(0.9) rotate(4deg)' },
  				'100%': { transform: 'scale(1) rotate(0)' }
  			},
  			'reaction-burst': {
  				'0%': { transform: 'rotate(var(--angle)) translateY(0) scale(1)', opacity: '1' },
  				'100%': { transform: 'rotate(var(--angle)) translateY(-20px) scale(0)', opacity: '0' }
  			},
  			'reaction-count': {
  				'0%': { transform: 'translateY(70%)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			},
  			'reaction-ring': {
  				'0%': { boxShadow: '0 0 0 0 rgb(59 130 246 / 0.45)' },
  				'100%': { boxShadow: '0 0 0 12px rgb(59 130 246 / 0)' }
  			}
  		},
  		animation: {
  			'bounce-slow': 'bounce 2s infinite',
  			'reaction-pop': 'reaction-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  			'reaction-burst': 'reaction-burst 550ms ease-out forwards',
  			'reaction-count': 'reaction-count 300ms ease-out',
  			'reaction-ring': 'reaction-ring 700ms ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

