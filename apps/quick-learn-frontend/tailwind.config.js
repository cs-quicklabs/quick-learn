const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
    "../../node_modules/flowbite-react/lib/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#93C5FD',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
