export interface ThemeColors {
  // Backgrounds
  background: {
    light: string;
    dark: string;
  };
  surface: {
    light: string;
    dark: string;
  };
  
  // Primary brand colors
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Accent colors
  accent: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  
  // Text colors
  text: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
  };
  
  // Border colors
  border: {
    light: string;
    dark: string;
  };
  
  // Interactive elements
  interactive: {
    hover: string;
    active: string;
    focus: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type ThemeMode = 'light' | 'dark';
