const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
    flowbite.content(),
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
    flowbite.content(),
  ],
};
