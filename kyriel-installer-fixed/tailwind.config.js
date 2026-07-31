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
        'kyriel-dark': '#0a0a0f',
        'kyriel-card': '#12121a',
        'kyriel-accent': '#00d4aa',
        'kyriel-purple': '#8b5cf6',
        'kyriel-cyan': '#06b6d4',
        'kyriel-success': '#22c55e',
        'kyriel-warning': '#f59e0b',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
