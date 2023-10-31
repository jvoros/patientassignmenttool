const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./client/index.html",
    "./client/src/**/*"
  ],
  theme: {
    extend: {
      width: {
        '128': '32rem',
      },
      fontFamily: {
        sans: [
          ...defaultTheme.fontFamily.sans,
        ]
      }
    },
  },
  plugins: [],
}

