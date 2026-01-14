# FormBuilder - Arquitectura Refactorizada

## 📁 Estructura del Proyecto

```
FormBuilder/
├── src/
│   ├── app/                    # Aplicación principal
│   │   ├── App.tsx            # Componente raíz
│   │   ├── index.tsx          # Entry point
│   │   └── layouts/           # Layouts de la aplicación
│   │
│   ├── config/                # Configuraciones
│   │   └── routes.ts         # Definición de rutas
│   │
│   ├── core/                  # Núcleo de la aplicación
│   │   ├── contexts/         # Context API de React
│   │   │   ├── FormRepositoryContext.tsx  # Contexto del repositorio de formularios
│   │   │   └── ThemeContext.tsx           # Contexto de temas
│   │   └── services/         # Servicios del core
│   │       ├── formService.ts          # Servicio de formularios
│   │       ├── mockMasterData.ts       # Datos maestros simulados
│   │       └── api/                    # APIs y clientes HTTP
│   │
│   ├── data/                  # Datos, seeds y configuraciones
│   │   ├── mock/             # Datos mock para desarrollo
│   │   │   ├── mockOnboardingData.ts  # Datos de onboarding
│   │   │   └── physicalColumns.ts     # Columnas físicas de BD
│   │   ├── seeds/            # Datos iniciales (seeds)
│   │   │   ├── initialFields.ts       # Campos de ejemplo iniciales
│   │   │   ├── initialQuestionnaire.ts # Cuestionarios iniciales
│   │   │   └── sharedLibrary.ts       # Biblioteca compartida
│   │   └── themes/           # Configuraciones de temas
│   │       └── themes.ts     # Definición de temas
│   │
│   ├── features/              # Características/módulos principales
│   │   ├── form-builder/     # Constructor de formularios
│   │   │   ├── components/
│   │   │   │   ├── Canvas/           # Área de trabajo principal
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── CanvasToolbar.tsx
│   │   │   │   │   ├── DragDropIndicators.tsx
│   │   │   │   │   ├── FieldActions.tsx
│   │   │   │   │   ├── FieldIndicators.tsx
│   │   │   │   │   ├── FieldInput.tsx
│   │   │   │   │   ├── FieldRenderer.tsx
│   │   │   │   │   └── ResizeHandle.tsx
│   │   │   │   ├── PropertiesPanel/  # Panel de propiedades
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── AppearanceSettings.tsx
│   │   │   │   │   ├── ConditionalLogic.tsx
│   │   │   │   │   ├── ContextualHelp.tsx
│   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   ├── FileConfiguration.tsx
│   │   │   │   │   ├── GeneralFormSettings.tsx
│   │   │   │   │   ├── GeneralSettings.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── Toolbox/          # Caja de herramientas
│   │   │   │       ├── index.tsx
│   │   │   │       └── ...
│   │   │   ├── hooks/
│   │   │   │   └── useFormBuilder.ts  # Hook principal del constructor
│   │   │   └── types/
│   │   │       └── masterData.ts     # Tipos de datos maestros
│   │   │
│   │   ├── form-explorer/    # Explorador de formularios
│   │   │   ├── components/
│   │   │   │   └── FormExplorer/
│   │   │   └── hooks/
│   │   │
│   │   ├── onboarding-builder/  # Constructor de onboarding
│   │   │   └── components/
│   │   │       ├── OnboardingBuilder/
│   │   │       ├── OnboardingConfig/
│   │   │       ├── OnboardingList/
│   │   │       └── StepCard/
│   │   │
│   │   ├── preview/          # Vista previa de formularios
│   │   │   ├── component/
│   │   │   │   └── PreviewModal/
│   │   │   └── hooks/
│   │   │
│   │   └── questionnaire-builder/  # Constructor de cuestionarios
│   │       └── components/
│   │           ├── QuestionItem/
│   │           ├── QuestionnaireBuilder/
│   │           └── ResultConfig/
│   │
│   ├── hooks/                 # Hooks globales reutilizables
│   │   └── useHistory.ts     # Hook para gestión de historial
│   │
│   ├── services/              # Servicios globales
│   │
│   ├── shared/                # Componentes y utilidades compartidas
│   │   ├── components/
│   │   │   ├── fields/       # Campos reutilizables
│   │   │   │   ├── DividerField.tsx
│   │   │   │   ├── FileButtonField.tsx
│   │   │   │   ├── GenericField.tsx
│   │   │   │   ├── GridCellInput.tsx
│   │   │   │   ├── GridField.tsx
│   │   │   │   ├── SectionField.tsx
│   │   │   │   └── SpacerField.tsx
│   │   │   ├── layouts/      # Layouts compartidos
│   │   │   │   └── Header/
│   │   │   ├── modals/       # Modales compartidos
│   │   │   │   └── ThemeConfig/
│   │   │   └── ui/           # Componentes UI básicos
│   │   │       ├── AutocompleteInput.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── SubTitle.tsx
│   │   │       ├── Title.tsx
│   │   │       └── ToggleSwitch.tsx
│   │   ├── hooks/            # Hooks compartidos
│   │   └── utils/            # Utilidades compartidas
│   │       ├── fieldHelpers.ts  # Helpers para campos
│   │       └── richText.ts      # Parser de texto enriquecido
│   │
│   ├── styles/                # Estilos globales
│   │   ├── index.css
│   │   └── tailwind/
│   │       └── tailwind.config.js
│   │
│   └── types/                 # Tipos TypeScript globales
│       ├── index.ts          # Tipos principales
│       ├── onboarding.ts     # Tipos de onboarding
│       ├── questionnaire.ts  # Tipos de cuestionarios
│       ├── repository.ts     # Tipos del repositorio
│       └── theme.ts          # Tipos de temas
│
├── ARCHITECTURE.md            # Arquitectura del proyecto
├── DOCUMENTO_FUNCIONAL_FORMULARIOS.md
├── FORMULARIOS.md
├── THEME_SYSTEM.md
├── README.md
├── index.html
├── metadata.json
├── package.json
├── postcss.config.js
├── tsconfig.json
├── vite-env.d.ts
└── vite.config.ts

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
