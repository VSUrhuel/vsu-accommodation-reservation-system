/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('flowbite/plugin')
]
,
  content: ["./dist/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  }
}

