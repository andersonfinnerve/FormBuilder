/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Colors (Mapped to CSS Variables from ThemeContext)
        background: {
            DEFAULT: 'var(--color-background)',
            light: 'var(--color-background)', // Legacy mapping
            dark: 'var(--color-background)',  // Legacy mapping
        },
        surface: {
            DEFAULT: 'var(--color-surface)',
            dark: 'var(--color-surface)', // Legacy mapping
        },
        primary: {
            DEFAULT: 'var(--color-primary)',
            light: 'var(--color-primary-light)',
            dark: 'var(--color-primary-dark)',
            contrast: 'var(--color-primary-contrast)',
        },
        text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
        },
        border: {
            DEFAULT: 'var(--color-border)',
            dark: 'var(--color-border)', // Legacy mapping
        },
        
        // Direct Legacy Class Mappings (for compatibility)
        'background-light': 'var(--color-background)',
        'background-dark': 'var(--color-background)',
        'surface-dark': 'var(--color-surface)',
        'border-dark': 'var(--color-border)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
    },
  },
  plugins: [],
}
