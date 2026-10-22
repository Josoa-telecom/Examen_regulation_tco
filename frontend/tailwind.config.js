export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { lagon: { 900: '#0A2F3C', 700: '#13566B', 100: '#DCEBEF', 50: '#F1F6F7' }, brume: '#EEF2F3' },
    fontFamily: { display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'], sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'] }
  } },
  plugins: []
}
