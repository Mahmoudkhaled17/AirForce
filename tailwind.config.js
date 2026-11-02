module.exports = {
  content: [
    "src/**/*.{js,jsx,ts,tsx}",
    "index.html",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#1f2937',
        },
        emerald: {
          500: '#10b981',
        },
        crimson: {
          500: '#dc2626',
        },
        amber: {
          500: '#ea580c',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}