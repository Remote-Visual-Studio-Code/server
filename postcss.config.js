/* eslint-disable */ const tailwind = require('tailwindcss');
module.exports = { plugins: ['postcss-preset-env', tailwind('./tailwind.js'), require('autoprefixer')] };
