# 📦 Guía de Barrel Exports

Esta guía muestra cómo usar el sistema de barrel exports implementado en el proyecto FormBuilder.

## 🎯 ¿Qué son Barrel Exports?

Son archivos `index.ts` que re-exportan múltiples módulos desde un solo punto de entrada, simplificando los imports.

## 📚 Imports Disponibles

### **Componentes UI**

```typescript
// ❌ Antes
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Select from '../../../shared/components/ui/Select';

// ✅ Ahora
import { Button, Input, Select } from '@/shared/components/ui';
// o mejor aún:
import { Button, Input, Select } from '@/shared';
```

**Componentes disponibles:**
- `AutocompleteInput`
- `Button`
- `Input`
- `Select`
- `SubTitle`
- `Title`
- `ToggleSwitch`

---

### **Componentes de Campos**

```typescript
// ✅ Import desde barrel
import { 
  DividerField, 
  FileButtonField, 
  GenericField, 
  GridField,
  SectionField 
} from '@/shared/components/fields';

// o desde shared directamente
import { DividerField, GridField } from '@/shared';
```

**Componentes disponibles:**
- `DividerField`
- `FileButtonField`
- `GenericField`
- `GridCellInput`
- `GridField`
- `SectionField`
- `SpacerField`

---

### **Utilidades**

```typescript
// ✅ Import de utilidades
import { 
  findFieldRecursive,
  updateFieldRecursive,
  deleteFieldRecursive,
  addFieldToParentRecursive,
  removeNode,
  insertNode
} from '@/shared/utils';

// También desde shared
import { findFieldRecursive } from '@/shared';
```

---

### **Contextos**

```typescript
// ✅ Import de contextos
import { ThemeContext, FormRepositoryContext } from '@/core/contexts';

// o desde core
import { ThemeContext } from '@/core';
```

---

### **Servicios**

```typescript
// ✅ Import de servicios
import { formService, mockMasterData } from '@/core/services';

// o desde core
import { formService } from '@/core';
```

---

### **Datos (Seeds & Mock)**

```typescript
// ✅ Import de seeds
import { initialFields, sharedLibrary } from '@/data/seeds';

// ✅ Import de mock data
import { mockOnboardingData, physicalColumns } from '@/data/mock';

// ✅ Import de temas
import { themes } from '@/data/themes';

// o todo desde data
import { initialFields, mockOnboardingData, themes } from '@/data';
```

---

### **Hooks Globales**

```typescript
// ✅ Import de hooks
import { useHistory } from '@/hooks';
```

---

### **Form Builder Feature**

```typescript
// ✅ Import de componentes del form builder
import { Canvas, PropertiesPanel, Toolbox } from '@/features/form-builder/components';

// ✅ Import del hook principal
import { useFormBuilder } from '@/features/form-builder/hooks';

// ✅ Import de tipos
import { /* tipos */ } from '@/features/form-builder/types';

// o todo junto
import { 
  Canvas, 
  PropertiesPanel, 
  useFormBuilder 
} from '@/features/form-builder';
```

---

### **Otras Features**

```typescript
// ✅ Form Explorer
import { FormExplorer } from '@/features/form-explorer';

// ✅ Onboarding Builder
import { 
  OnboardingBuilder,
  OnboardingConfig,
  OnboardingList,
  StepCard 
} from '@/features/onboarding-builder';

// ✅ Preview
import { PreviewModal } from '@/features/preview';

// ✅ Questionnaire Builder
import { 
  QuestionnaireBuilder,
  QuestionItem,
  ResultConfig 
} from '@/features/questionnaire-builder';
```

---

### **Tipos**

```typescript
// ✅ Import de tipos globales (ya existe el barrel)
import { 
  FormField, 
  FieldType, 
  LogicRule,
  GridColumn,
  FormConfig 
} from '@/types';
```

---

## 🔧 Configuración de Path Aliases

Asegúrate de tener configurado en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Y en `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

---

## ✨ Beneficios

1. **Imports más limpios**: Menos ruido visual en los archivos
2. **Fácil refactorización**: Cambiar estructura interna sin romper imports
3. **Mejor autocompletado**: IDEs muestran todas las exportaciones disponibles
4. **Menos dependencias relativas**: Evita imports como `../../../shared/...`
5. **Organización clara**: Punto de entrada único por módulo

---

## 📝 Convenciones

- Usar `export *` para re-exportar todo de un módulo
- Usar `export { nombre }` para exportaciones específicas con nombres
- Usar `export { default as Nombre }` para componentes con default export
- No exportar features desde el barrel principal (`/src/index.ts`) para evitar dependencias circulares

---

## 🚀 Ejemplo de Refactorización

### Antes:
```typescript
import React from 'react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { FormField } from '../../../types';
import { useHistory } from '../../../hooks/useHistory';
import { findFieldRecursive } from '../../../shared/utils/fieldHelpers';
```

### Después:
```typescript
import React from 'react';
import { Button, Input } from '@/shared';
import { FormField } from '@/types';
import { useHistory } from '@/hooks';
import { findFieldRecursive } from '@/shared';
```

Mucho más limpio y mantenible! 🎉
