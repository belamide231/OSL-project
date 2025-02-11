/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {      transitionTimingFunction: {
      'in-out-custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    transitionDuration: {
      'fast': '150ms',
      'slow': '500ms',
    },
    colors: {
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
      accent: 'var(--accent-color)',
      whites: 'var(--whites-color)',  },},
  
},
  plugins: [],
};

