import { Theme } from '../../types/theme';

// Tema por defecto - Azul
export const defaultTheme: Theme = {
  id: 'default',
  name: 'Azul Profesional',
  colors: {
    background: {
      light: '#f8fafc',
      dark: '#0f172a'
    },
    surface: {
      light: '#ffffff',
      dark: '#1e293b'
    },
    primary: {
      main: '#258cf4',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrast: '#ffffff'
    },
    accent: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4'
    },
    text: {
      primary: {
        light: '#0f172a',
        dark: '#f1f5f9'
      },
      secondary: {
        light: '#64748b',
        dark: '#94a3b8'
      }
    },
    border: {
      light: '#e2e8f0',
      dark: '#334155'
    },
    interactive: {
      hover: 'rgba(37, 140, 244, 0.1)',
      active: 'rgba(37, 140, 244, 0.2)',
      focus: 'rgba(37, 140, 244, 0.3)'
    }
  }
};

// Tema Verde Corporativo
export const greenTheme: Theme = {
  id: 'green',
  name: 'Verde Corporativo',
  colors: {
    background: {
      light: '#f0fdf4',
      dark: '#022c22'
    },
    surface: {
      light: '#ffffff',
      dark: '#064e3b'
    },
    primary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrast: '#ffffff'
    },
    accent: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4'
    },
    text: {
      primary: {
        light: '#022c22',
        dark: '#ecfdf5'
      },
      secondary: {
        light: '#4ade80',
        dark: '#86efac'
      }
    },
    border: {
      light: '#d1fae5',
      dark: '#065f46'
    },
    interactive: {
      hover: 'rgba(16, 185, 129, 0.1)',
      active: 'rgba(16, 185, 129, 0.2)',
      focus: 'rgba(16, 185, 129, 0.3)'
    }
  }
};

// Tema Púrpura Moderno
export const purpleTheme: Theme = {
  id: 'purple',
  name: 'Púrpura Moderno',
  colors: {
    background: {
      light: '#faf5ff',
      dark: '#1e1b4b'
    },
    surface: {
      light: '#ffffff',
      dark: '#312e81'
    },
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrast: '#ffffff'
    },
    accent: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4'
    },
    text: {
      primary: {
        light: '#1e1b4b',
        dark: '#f5f3ff'
      },
      secondary: {
        light: '#7c3aed',
        dark: '#c4b5fd'
      }
    },
    border: {
      light: '#e9d5ff',
      dark: '#4c1d95'
    },
    interactive: {
      hover: 'rgba(139, 92, 246, 0.1)',
      active: 'rgba(139, 92, 246, 0.2)',
      focus: 'rgba(139, 92, 246, 0.3)'
    }
  }
};

// Tema Naranja Energético
export const orangeTheme: Theme = {
  id: 'orange',
  name: 'Naranja Energético',
  colors: {
    background: {
      light: '#fff7ed',
      dark: '#431407'
    },
    surface: {
      light: '#ffffff',
      dark: '#7c2d12'
    },
    primary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c',
      contrast: '#ffffff'
    },
    accent: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4'
    },
    text: {
      primary: {
        light: '#431407',
        dark: '#ffedd5'
      },
      secondary: {
        light: '#ea580c',
        dark: '#fdba74'
      }
    },
    border: {
      light: '#fed7aa',
      dark: '#9a3412'
    },
    interactive: {
      hover: 'rgba(249, 115, 22, 0.1)',
      active: 'rgba(249, 115, 22, 0.2)',
      focus: 'rgba(249, 115, 22, 0.3)'
    }
  }
};

export const availableThemes: Theme[] = [
  defaultTheme,
  greenTheme,
  purpleTheme,
  orangeTheme
];
