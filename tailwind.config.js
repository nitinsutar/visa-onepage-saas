/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: { colors: { brand: { 50:'#f5f7ff',100:'#ebf0ff',600:'#2536eb',700:'#1b29b8' } } } },
  plugins: [],
}