import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
		fontSize: {
        // Responsive font sizes for mobile-first scaling
        'main-heading': ['28px', { lineHeight: '36px' }],
        'main-heading-lg': ['36px', { lineHeight: '44px' }],
        'sub-heading': ['16px', { lineHeight: '20px' }],
        'sub-heading-lg': ['20px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'button': ['14px', { lineHeight: 'normal' }],
        'button-lg': ['16px', { lineHeight: 'normal' }],
        'caption': ['12px', { lineHeight: '16px' }],
        'caption-lg': ['14px', { lineHeight: '20px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '700',
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',

			// Brand Colors
			brand: {
				primary: '#FF9000',
				'primary-hover': '#E68200',
				'primary-light': '#FFA726',
				'primary-disabled': '#FFD4A3',
				error: '#DE1135',
				'error-hover': '#B90E2C',
				'error-light': '#F8D7DA',
				warning: '#F6BC2F',
				'warning-hover': '#DDA929',
				'warning-light': '#FFF4D5',
			},

			// Semantic Colors
			heading: '#2B2D42',
			text: '#757575',
			'text-light': '#9CA3AF',
			'text-dark': '#2B2D42',

			// Button Colors
			'btn-text': '#2B2D42',
			'btn-secondary': '#2B2D42',
			'btn-secondary-text': '#F6F6F6',

  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
