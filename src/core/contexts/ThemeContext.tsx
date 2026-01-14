import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeMode } from '../../types/theme';
import { defaultTheme } from '../../data/themes/themes';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app-theme-mode');
    return (saved as ThemeMode) || 'dark';
  });

  // Apply theme function
  const applyTheme = React.useCallback(() => {
    const root = document.documentElement;
    const colors = theme.colors;

    // Apply CSS variables
    root.style.setProperty('--color-background', mode === 'light' ? colors.background.light : colors.background.dark);
    root.style.setProperty('--color-surface', mode === 'light' ? colors.surface.light : colors.surface.dark);
    root.style.setProperty('--color-primary', colors.primary.main);
    root.style.setProperty('--color-primary-light', colors.primary.light);
    root.style.setProperty('--color-primary-dark', colors.primary.dark);
    root.style.setProperty('--color-primary-contrast', colors.primary.contrast);
    root.style.setProperty('--color-success', colors.accent.success);
    root.style.setProperty('--color-error', colors.accent.error);
    root.style.setProperty('--color-warning', colors.accent.warning);
    root.style.setProperty('--color-info', colors.accent.info);
    root.style.setProperty('--color-text-primary', mode === 'light' ? colors.text.primary.light : colors.text.primary.dark);
    root.style.setProperty('--color-text-secondary', mode === 'light' ? colors.text.secondary.light : colors.text.secondary.dark);
    root.style.setProperty('--color-border', mode === 'light' ? colors.border.light : colors.border.dark);
    root.style.setProperty('--color-interactive-hover', colors.interactive.hover);
    root.style.setProperty('--color-interactive-active', colors.interactive.active);
    root.style.setProperty('--color-interactive-focus', colors.interactive.focus);

    // Toggle dark class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mode]);

  // Apply theme on mount and when theme/mode changes
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme));
  }, [theme]);

  // Save mode to localStorage
  useEffect(() => {
    localStorage.setItem('app-theme-mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
