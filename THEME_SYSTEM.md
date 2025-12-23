# Sistema de Temas - Guía de Uso

## 🎨 Características

El sistema de temas permite:
- ✅ Cambiar entre modo claro y oscuro
- ✅ Seleccionar entre múltiples esquemas de color predefinidos
- ✅ Personalización completa de colores para cada cliente
- ✅ Persistencia en localStorage
- ✅ Cambios en tiempo real sin recargar

## 📋 Temas Predefinidos

### 1. Azul Profesional (Default)
- **ID**: `default`
- **Color Principal**: #258cf4
- **Uso**: Tema estándar de la aplicación

### 2. Verde Corporativo
- **ID**: `green`
- **Color Principal**: #10b981
- **Uso**: Empresas ecológicas, sostenibilidad

### 3. Púrpura Moderno
- **ID**: `purple`
- **Color Principal**: #8b5cf6
- **Uso**: Empresas creativas, tech startups

### 4. Naranja Energético
- **ID**: `orange`
- **Color Principal**: #f97316
- **Uso**: Empresas dinámicas, deportes, energía

## 🔧 Cómo Agregar un Nuevo Tema

### 1. Definir el tema en `src/data/themes.ts`:

```typescript
export const customTheme: Theme = {
  id: 'custom',
  name: 'Mi Tema Personalizado',
  colors: {
    background: {
      light: '#f8fafc',  // Fondo en modo claro
      dark: '#0f172a'    // Fondo en modo oscuro
    },
    surface: {
      light: '#ffffff',  // Superficie en modo claro
      dark: '#1e293b'    // Superficie en modo oscuro
    },
    primary: {
      main: '#3b82f6',     // Color principal
      light: '#60a5fa',    // Variante clara
      dark: '#2563eb',     // Variante oscura
      contrast: '#ffffff'  // Color de contraste (texto sobre primary)
    },
    accent: {
      success: '#10b981',  // Verde para éxito
      error: '#ef4444',    // Rojo para errores
      warning: '#f59e0b',  // Amarillo para advertencias
      info: '#06b6d4'      // Cian para información
    },
    text: {
      primary: {
        light: '#0f172a',  // Texto principal modo claro
        dark: '#f1f5f9'    // Texto principal modo oscuro
      },
      secondary: {
        light: '#64748b',  // Texto secundario modo claro
        dark: '#94a3b8'    // Texto secundario modo oscuro
      }
    },
    border: {
      light: '#e2e8f0',    // Bordes modo claro
      dark: '#334155'      // Bordes modo oscuro
    },
    interactive: {
      hover: 'rgba(59, 130, 246, 0.1)',   // Hover state
      active: 'rgba(59, 130, 246, 0.2)',  // Active state
      focus: 'rgba(59, 130, 246, 0.3)'    // Focus state
    }
  }
};
```

### 2. Agregar a la lista de temas disponibles:

```typescript
export const availableThemes: Theme[] = [
  defaultTheme,
  greenTheme,
  purpleTheme,
  orangeTheme,
  customTheme  // ← Agregar aquí
];
```

## 💻 Uso Programático

### Acceder al tema actual:

```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme();
  
  // Cambiar tema
  const handleChangeTheme = () => {
    setTheme(customTheme);
  };
  
  // Cambiar modo
  const handleToggleMode = () => {
    toggleMode(); // Alterna entre light y dark
  };
  
  return (
    <div>
      <p>Tema actual: {theme.name}</p>
      <p>Modo actual: {mode}</p>
    </div>
  );
};
```

### Usar colores del tema:

```typescript
// En componentes React
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Contenido
</div>

// O usar las clases de Tailwind personalizadas
<button className="bg-primary text-white hover:bg-primary-dark">
  Botón
</button>
```

## 🎯 Variables CSS Disponibles

Todas las variables están disponibles globalmente:

```css
--color-background         /* Fondo principal */
--color-surface            /* Superficie (cards, modales) */
--color-primary            /* Color principal de marca */
--color-primary-light      /* Variante clara del principal */
--color-primary-dark       /* Variante oscura del principal */
--color-primary-contrast   /* Contraste sobre primary */
--color-success            /* Verde para éxito */
--color-error              /* Rojo para errores */
--color-warning            /* Amarillo para advertencias */
--color-info               /* Cian para información */
--color-text-primary       /* Texto principal */
--color-text-secondary     /* Texto secundario */
--color-border             /* Bordes */
--color-interactive-hover  /* Estado hover */
--color-interactive-active /* Estado active */
--color-interactive-focus  /* Estado focus */
```

## 🏢 Configuración por Cliente

Para configurar un tema específico para un cliente:

1. Crear un nuevo tema con los colores corporativos del cliente
2. Establecer el tema al iniciar la aplicación:

```typescript
// En App.tsx o index.tsx
import { clientTheme } from './data/themes/client-xyz';

// Establecer tema del cliente
useEffect(() => {
  setTheme(clientTheme);
}, []);
```

## 💾 Persistencia

Los temas se guardan automáticamente en localStorage:
- **Clave del tema**: `app-theme`
- **Clave del modo**: `app-theme-mode`

El tema se restaura automáticamente al recargar la página.

## 🎨 Mejores Prácticas

1. **Mantener contraste**: Asegurar que los colores tengan suficiente contraste para accesibilidad
2. **Probar ambos modos**: Siempre verificar que el tema se vea bien en modo claro y oscuro
3. **Usar variables CSS**: Preferir `var(--color-primary)` sobre colores hardcodeados
4. **Documentar**: Agregar descripción clara al crear nuevos temas

## 🔄 Actualización en Tiempo Real

Los cambios de tema se aplican inmediatamente sin necesidad de recargar:
- El `ThemeContext` escucha cambios y actualiza las variables CSS
- Todos los componentes que usan las variables se actualizan automáticamente
