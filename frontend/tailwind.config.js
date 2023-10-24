/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontSize: {
      '4xl': ['1.8rem', {
        lineHeight: '2rem',
        letterSpacing: '-0.01em',
        fontWeight: '500',
      }],
      '9xl': ['7rem', {
        lineHeight: '2.25rem',
        letterSpacing: '-0.02em',
        fontWeight: '700',
      }],
    }
  },
  plugins: [],
}
