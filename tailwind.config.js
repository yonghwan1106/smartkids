/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          '50': '#EAF2FB',
          '100': '#D6E5F8',
          '200': '#ADC9F1',
          '300': '#84ADEA',
          '400': '#5B92E3',
          '500': '#4A90E2',
          '600': '#3A73B5',
          '700': '#2D5888',
          '800': '#1F3C5A',
          '900': '#122133'
        },
        secondary: '#50E3C2',
        accent: '#F5A623',
        gray: {
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F3C5A',
          '900': '#111827',
        }
      }
    }
  },
  plugins: [],
}

