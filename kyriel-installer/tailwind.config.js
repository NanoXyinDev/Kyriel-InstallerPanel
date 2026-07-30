/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kyriel: {
          dark: '#0a0a0f',
          card: '#12121a',
          accent: '#ff3366',
          cyan: '#00f0ff',
          purple: '#b829dd',
          success: '#00ff88',
          warning: '#ffaa00'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
        'scan': 'scan 4s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ff3366, 0 0 10px #ff3366' },
          '100%': { boxShadow: '0 0 20px #ff3366, 0 0 30px #ff3366' }
        }
      }
    },
  },
  plugins: [],
}
