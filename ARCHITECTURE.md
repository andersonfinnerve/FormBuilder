# FormBuilder - Arquitectura Refactorizada

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes de UI organizados por feature
│   ├── Canvas/         # Componentes del área de trabajo
│   │   ├── index.tsx           # Componente principal Canvas
│   │   ├── FieldRenderer.tsx   # Renderizador recursivo de campos
│   │   ├── FieldInput.tsx      # Inputs específicos por tipo
│   │   ├── FieldActions.tsx    # Botones de acción (duplicar, eliminar)
│   │   ├── FieldIndicators.tsx # Indicadores visuales (compartido, lógica)
│   │   ├── ResizeHandle.tsx    # Control de redimensionamiento
│   │   ├── DragDropIndicators.tsx # Indicadores de zona de drop
│   │   └── CanvasToolbar.tsx   # Barra de herramientas superior
│   │
│   ├── PropertiesPanel/  # Panel de propiedades lateral derecho
│   │   ├── index.tsx              # Componente principal
│   │   ├── EmptyState.tsx         # Estado cuando no hay selección
│   │   ├── PanelHeader.tsx        # Encabezado del panel
│   │   ├── GeneralSettings.tsx    # Configuración general
│   │   ├── FileConfiguration.tsx  # Config específica de archivos
│   │   ├── OptionsManagement.tsx  # Gestión de opciones (select/radio)
│   │   ├── GridColumnsConfig.tsx  # Configuración de columnas de grilla
│   │   ├── ValidationRules.tsx    # Reglas de validación
│   │   ├── ConditionalLogic.tsx   # Lógica condicional
│   │   ├── AppearanceSettings.tsx # Configuración de apariencia
│   │   └── ContextualHelp.tsx     # Tips contextuales
│   │
│   ├── PreviewModal/     # Modal de vista previa
│   │   ├── index.tsx         # Componente principal
│   │   └── PreviewField.tsx  # Renderizador de campos en preview
│   │
│   ├── Toolbox/          # Caja de herramientas lateral izquierda
│   │   ├── index.tsx         # Componente principal
│   │   └── ToolboxItem.tsx   # Item individual arrastrable
│   │
│   └── Header/           # Encabezado de la aplicación
│       └── index.tsx
│
├── hooks/              # Custom hooks reutilizables
│   └── useFormBuilder.ts  # Hook principal con toda la lógica de negocio
│
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts          # Tipos: FormField, FieldType, LogicRule, etc.
│
├── utils/              # Funciones utilitarias
│   ├── fieldHelpers.ts   # Helpers para manipular árbol de campos
│   └── richText.ts       # Parser de texto enriquecido (Markdown)
│
├── data/               # Datos iniciales y configuraciones
│   ├── initialFields.ts    # Campos de ejemplo iniciales
│   └── sharedLibrary.ts    # Biblioteca de campos compartidos
│
├── App.tsx             # Componente raíz de la aplicación
└── index.tsx           # Entry point

```

## 🎯 Beneficios de la Refactorización

### ✅ Separación de Responsabilidades
- **Cada componente tiene una única responsabilidad**
- Componentes pequeños y enfocados (< 200 líneas)
- Fácil de entender y mantener

### 🔄 Reutilización de Código
- Componentes como `FieldActions`, `FieldIndicators` se pueden usar en diferentes contextos
- Hook `useFormBuilder` centraliza toda la lógica de negocio
- Utilidades en `fieldHelpers` reutilizables en toda la app

### 🧪 Facilita Testing
- Componentes pequeños son más fáciles de testear
- Funciones puras en `utils/` son completamente testables
- Mock de datos separado en `data/`

### 📦 Mejor Organización
- Estructura clara por features
- Imports más limpios
- Código relacionado agrupado junto

### 🚀 Escalabilidad
- Fácil agregar nuevos tipos de campos
- Nuevas funcionalidades se agregan sin tocar código existente
- Preparado para crecer

## 🔑 Componentes Clave

### `useFormBuilder` Hook
Centraliza toda la lógica de estado y operaciones:
- Gestión de campos (agregar, eliminar, actualizar)
- Drag & Drop
- Selección de campos
- Duplicación

### `FieldRenderer` Component
Componente recursivo que renderiza campos y secciones anidadas con todas sus características visuales.

### `PropertiesPanel` Component
Sistema modular de paneles que se adapta al tipo de campo seleccionado.

## 📝 Convenciones

- **Componentes**: PascalCase, un archivo por componente
- **Hooks**: camelCase con prefijo `use`
- **Tipos**: PascalCase para interfaces, camelCase para tipos básicos
- **Utilidades**: camelCase para funciones
- **Barrel Exports**: `index.tsx` en cada carpeta de componente

## 🚀 Próximos Pasos

1. Agregar tests unitarios para utilidades
2. Implementar tests de componentes con React Testing Library
3. Añadir documentación JSDoc
4. Implementar sistema de validación de formularios
5. Agregar más tipos de campos personalizados
