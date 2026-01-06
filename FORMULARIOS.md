# 📋 Sistema de Formularios

## Descripción General

El **Sistema de Formularios** es un constructor visual drag-and-drop que permite a los usuarios crear y configurar formularios dinámicos sin necesidad de programar. Los formularios configurados se exportan como JSON para ser consumidos por aplicaciones web públicas que renderizan los campos dinámicamente.

## 🎯 Propósito

- **Configurador Visual**: Interfaz intuitiva para diseñar formularios complejos
- **Datos Maestros**: Integración con el BackOffice para reutilizar campos estandarizados
- **Lógica Condicional**: Mostrar/ocultar campos según respuestas del usuario
- **Export/Import**: Formularios portables en formato JSON
- **Renderizado Dinámico**: JSON autosuficiente para la web pública

---

## 🏗️ Arquitectura

### Flujo de Datos

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Form Builder   │─────▶│   Backend    │─────▶│   Web Pública   │
│ (Configurador)  │      │   (API)      │      │  (Renderizado)  │
└─────────────────┘      └──────────────┘      └─────────────────┘
        │                       │                       │
        │                       │                       │
    JSON Config           Sincroniza              Evalúa JSON
    + Referencias         Maestro Datos           + Lógica Local
```

### Componentes Principales

```
src/
├── components/
│   ├── Canvas/              # Área de construcción del formulario
│   ├── Toolbox/             # Caja de herramientas con campos disponibles
│   ├── PropertiesPanel/     # Panel de configuración de propiedades
│   ├── FormExplorer/        # Árbol de navegación del formulario
│   └── PreviewModal/        # Vista previa del formulario
├── hooks/
│   ├── useFormBuilder.ts    # Lógica principal del builder
│   └── useHistory.ts        # Undo/Redo
├── types/
│   └── index.ts             # Definiciones de tipos TypeScript
└── data/
    ├── mockMasterData.ts    # Datos maestros del BackOffice
    └── initialFields.ts     # Campos de ejemplo
```

---

## 📊 Estructura de Datos

### FormField (Campo de Formulario)

```typescript
interface FormField {
  id: string;                    // ID único local (frontend)
  type: FieldType;               // Tipo de campo
  label: string;                 // Etiqueta visible
  placeholder?: string;          // Texto de ayuda
  description?: string;          // Descripción/ayuda adicional
  required: boolean;             // Si es obligatorio
  readOnly: boolean;             // Si es solo lectura
  order: number;                 // Orden de renderizado
  width: 'full' | 'half';        // Ancho del campo
  
  // Opciones para campos de selección
  options?: string[];            // Opciones (formato simple)
  formDataOptions?: FormDataOption[] | null;  // Opciones con IDs del maestro
  
  // Grillas
  columns?: GridColumn[];        // Columnas para campos tipo 'grid'
  
  // Referencias al Maestro de Datos
  formDataId?: string | null;         // ID del maestro (text, select, etc.)
  formDataGridId?: string | null;     // ID del maestro para grids
  
  // Lógica Condicional
  logic?: LogicRule;             // Regla de visibilidad condicional
  
  // Mapeo Físico
  physicalColumn?: string;       // Mapeo a entidad del sistema
  sharedSource?: string;         // ID de biblioteca compartida
  
  // Secciones
  children?: FormField[];        // Campos hijos (secciones)
  
  // Archivos
  fileStyle?: 'dropzone' | 'button';
  downloadUrl?: string;
  downloadText?: string;
}
```

### Valores Especiales de IDs del Maestro

| Valor | Significado | Acción Backend |
|-------|-------------|----------------|
| `null` | Campo nuevo creado manualmente | Debe crear el registro en el maestro |
| `"md_001"` | Campo del maestro existente | Ya existe, usar referencia |
| `undefined` | No aplica (ej: spacer, divider) | Ignorar |

---

## 🎨 Tipos de Campos

### Básicos
- **text**: Texto corto
- **textarea**: Párrafo largo
- **number**: Número
- **email**: Correo electrónico

### Selección
- **checkbox**: Casilla de verificación
- **radio**: Opción única
- **select**: Lista desplegable

### Avanzados
- **date**: Fecha y hora
- **file**: Subir archivo
- **grid**: Tabla de datos con filas dinámicas

### Diseño
- **section**: Agrupador de campos con título
- **spacer**: Espaciador invisible
- **divider**: Línea separadora

---

## 🗄️ Integración con Datos Maestros

### ¿Qué son los Datos Maestros?

Son campos estandarizados del BackOffice que garantizan consistencia entre formularios:

```typescript
interface MasterData {
  id: string;                    // FormDataId del maestro
  name: string;                  // Nombre del campo
  type: 'text' | 'registry' | 'grid';
  
  // Para tipo 'text'
  maxLength?: number;
  
  // Para tipo 'registry' (select)
  options?: MasterDataOption[];
  
  // Para tipo 'grid'
  columns?: MasterDataGridColumn[];
  
  description?: string;
  lastModified?: string;
}
```

### Ejemplo de Campo del Maestro

**Configuración:**
```json
{
  "id": "field_123",
  "type": "select",
  "label": "Actividad profesional actual",
  "formDataId": "md_001",
  "options": ["Empleado", "Autónomo", "Empresario"],
  "formDataOptions": [
    { "value": "Empleado", "formDataOptionId": "opt_001_1" },
    { "value": "Autónomo", "formDataOptionId": "opt_001_2" },
    { "value": "Empresario", "formDataOptionId": "opt_001_3" }
  ]
}
```

**Restricciones:**
- ❌ No se puede editar la etiqueta
- ❌ No se pueden modificar las opciones
- ✅ Se puede cambiar si es requerido
- ✅ Se puede configurar lógica condicional

---

## 🔄 Lógica Condicional

Permite mostrar/ocultar campos según las respuestas del usuario.

### Estructura

```typescript
interface LogicRule {
  triggerId: string;              // ID local del campo trigger (para UI)
  triggerFormDataId?: string | null;  // ID del maestro del trigger
  value: string;                  // Valor que activa la regla
  enabled: boolean;               // Si la regla está activa
}
```

### Sistema Dual de Referencias

**¿Por qué dos IDs?**

1. **`triggerId`** (ID local): 
   - Usado por la web pública para evaluar la lógica
   - Siempre presente en el JSON
   - Funciona sin depender del backend

2. **`triggerFormDataId`** (ID del maestro):
   - Usado por el backend para sincronizar
   - `null` si el trigger es un campo nuevo
   - `"md_xxx"` si el trigger viene del maestro

### Ejemplo

```json
{
  "id": "section_beneficiarios",
  "type": "section",
  "label": "Beneficiarios Finales",
  "logic": {
    "triggerId": "tiene_beneficiarios",
    "triggerFormDataId": null,
    "value": "Sí",
    "enabled": true
  }
}
```

**Interpretación:**
- Mostrar `section_beneficiarios` cuando el campo `tiene_beneficiarios` sea igual a `"Sí"`
- El campo trigger es nuevo (no viene del maestro)

---

## 📦 Grillas (Grid Fields)

Las grillas permiten al usuario ingresar múltiples filas de datos estructurados.

### Estructura

```typescript
interface GridColumn {
  id: string;
  label: string;
  type: 'text' | 'select' | 'file';
  required: boolean;
  formDataGridColumnId?: string | null;  // ID maestro de columna
  formDataOptions?: FormDataOption[] | null;  // Opciones con IDs
}
```

### Ejemplo Completo

**Grid del Maestro:**
```json
{
  "id": "grid_001",
  "type": "grid",
  "label": "Lista de Beneficiarios",
  "formDataGridId": "md_grid_001",
  "columns": [
    {
      "id": "col_001",
      "label": "País",
      "type": "select",
      "required": true,
      "formDataGridColumnId": "col_001",
      "formDataOptions": [
        { "value": "Chile", "formDataOptionId": "opt_col_001_1" },
        { "value": "Argentina", "formDataOptionId": "opt_col_001_2" }
      ]
    },
    {
      "id": "col_002",
      "label": "RUT",
      "type": "text",
      "required": true,
      "formDataGridColumnId": "col_002"
    }
  ]
}
```

**Grid Nuevo:**
```json
{
  "id": "grid_002",
  "type": "grid",
  "label": "Referencias Comerciales",
  "formDataGridId": null,
  "columns": [
    {
      "id": "c1",
      "label": "Empresa",
      "type": "text",
      "required": true,
      "formDataGridColumnId": null
    }
  ]
}
```

---

## 🔧 Funcionalidades del Builder

### 1. Drag & Drop

- Arrastrar campos desde la **Toolbox** al **Canvas**
- Reordenar campos arrastrándolos
- Anidar campos dentro de **Secciones**
- Indicadores visuales de posición de drop

### 2. Redimensionamiento

- Campos de ancho completo (`width: 'full'`)
- Campos de medio ancho (`width: 'half'`)
- Handle de redimensionamiento con botón de alternar

### 3. Configuración de Propiedades

**General:**
- Etiqueta del campo
- Placeholder
- Descripción (soporta Markdown)
- Requerido / Solo lectura
- Mapeo a campo físico

**Opciones (Select/Radio):**
- Agregar/Eliminar opciones
- Origen: Manual, Biblioteca Central, o Dato Maestro

**Validaciones:**
- Longitud mínima/máxima
- Patrones regex
- Rangos numéricos

**Apariencia:**
- Estilos personalizados
- Iconos
- Hints contextuales

**Lógica Condicional:**
- Campo trigger
- Valor de activación
- Habilitar/Deshabilitar

### 4. Historial (Undo/Redo)

- Stack de cambios con descripción
- Deshacer: Ctrl+Z
- Rehacer: Ctrl+Y
- Límite de 50 snapshots

### 5. Export/Import

**Export:**
```typescript
const formConfig = {
  title: "Formulario de Inscripción",
  description: "...",
  fields: [...],
  metadata: {
    version: "1.0",
    createdAt: "2026-01-04",
    author: "..."
  }
};
```

**Import:**
- Cargar JSON desde archivo
- Validación de estructura
- Restaurar estado del builder

---

## 🚀 Flujo de Trabajo

### Caso de Uso: Crear Formulario de Onboarding

1. **Inicio**
   - Abrir Form Builder
   - Crear nuevo formulario o cargar plantilla

2. **Agregar Campos del Maestro**
   - Buscar "Actividad profesional" en Datos Maestros
   - Arrastrar al canvas
   - ✅ Campo bloqueado (no editable)

3. **Agregar Campos Personalizados**
   - Agregar campo "Texto Corto" desde Toolbox
   - Renombrar a "Comentarios adicionales"
   - Configurar como opcional
   - ✅ Campo tiene `formDataId: null`

4. **Crear Sección con Lógica**
   - Agregar campo "Radio" → "¿Tiene beneficiarios?"
   - Agregar "Sección" → "Datos de Beneficiarios"
   - Configurar lógica: Mostrar si "¿Tiene beneficiarios?" = "Sí"

5. **Agregar Grid del Maestro**
   - Buscar "Beneficiarios Finales" en Datos Maestros
   - Arrastrar dentro de la sección
   - ✅ Grid completo con columnas bloqueadas

6. **Preview y Export**
   - Click en "Vista Previa"
   - Verificar lógica condicional
   - Exportar JSON
   - Enviar al backend

---

## 📤 Integración con Backend

### Endpoint de Guardado (Propuesto)

```http
POST /api/forms
Content-Type: application/json

{
  "title": "Formulario de Inscripción",
  "fields": [ /* FormField[] */ ],
  "metadata": { /* ... */ }
}
```

### Procesamiento Backend

1. **Identificar Campos Nuevos**
   ```javascript
   if (field.formDataId === null) {
     // Crear nuevo campo en maestro
     const newMasterDataId = await createMasterData({
       name: field.label,
       type: mapFieldType(field.type),
       options: field.options
     });
     field.formDataId = newMasterDataId;
   }
   ```

2. **Actualizar Referencias de Lógica**
   ```javascript
   if (field.logic && field.logic.triggerFormDataId === null) {
     // Buscar el formDataId real del trigger
     const triggerField = findField(field.logic.triggerId);
     field.logic.triggerFormDataId = triggerField.formDataId;
   }
   ```

3. **Sincronizar Grids**
   ```javascript
   if (field.type === 'grid' && field.formDataGridId === null) {
     const gridId = await createMasterGrid({
       name: field.label,
       columns: field.columns.map(col => ({
         label: col.label,
         type: col.type,
         options: col.formDataOptions
       }))
     });
     field.formDataGridId = gridId;
   }
   ```

4. **Guardar Configuración Final**
   ```javascript
   await db.forms.insert({
     id: generateId(),
     config: processedFields,
     createdAt: new Date()
   });
   ```

---

## 🌐 Renderizado en Web Pública

### Consumo del JSON

```javascript
// Cargar formulario
const formConfig = await fetch('/api/forms/123').then(r => r.json());

// Renderizar campos
formConfig.fields.forEach(field => {
  const component = createFieldComponent(field);
  
  // Evaluar lógica condicional (usa triggerId local)
  if (field.logic && field.logic.enabled) {
    const triggerField = findFieldById(field.logic.triggerId);
    const triggerValue = getFieldValue(triggerField.id);
    
    if (triggerValue !== field.logic.value) {
      component.hide();
    }
  }
  
  container.appendChild(component);
});
```

### Ventajas del JSON Autosuficiente

✅ No depende del backend para evaluar lógica  
✅ Funciona offline  
✅ Fácil de debuggear  
✅ Portable entre sistemas  

---

## 🔐 Validaciones y Restricciones

### Campos del Maestro

| Propiedad | ¿Editable? |
|-----------|-----------|
| Etiqueta | ❌ No |
| Opciones | ❌ No |
| Requerido | ✅ Sí |
| Descripción local | ✅ Sí |
| Lógica condicional | ✅ Sí |
| Ancho | ✅ Sí |

### Campos Nuevos

| Propiedad | ¿Editable? |
|-----------|-----------|
| Todo | ✅ Sí |

---

## 📝 Ejemplos de JSON

### Campo Texto Simple (Nuevo)

```json
{
  "id": "nombre_completo",
  "type": "text",
  "label": "Nombre Completo",
  "placeholder": "Ej. Juan Pérez",
  "required": true,
  "readOnly": false,
  "order": 1,
  "width": "full",
  "formDataId": null
}
```

### Campo Select del Maestro

```json
{
  "id": "actividad_profesional",
  "type": "select",
  "label": "Actividad profesional actual",
  "placeholder": "Seleccione una opción...",
  "required": false,
  "order": 2,
  "width": "half",
  "formDataId": "md_001",
  "options": ["Empleado", "Autónomo", "Empresario"],
  "formDataOptions": [
    { "value": "Empleado", "formDataOptionId": "opt_001_1" },
    { "value": "Autónomo", "formDataOptionId": "opt_001_2" },
    { "value": "Empresario", "formDataOptionId": "opt_001_3" }
  ]
}
```

### Sección con Lógica Condicional

```json
{
  "id": "seccion_beneficiarios",
  "type": "section",
  "label": "BENEFICIARIOS FINALES",
  "description": "Complete esta sección solo si aplica",
  "required": false,
  "order": 3,
  "width": "full",
  "logic": {
    "triggerId": "tiene_beneficiarios",
    "triggerFormDataId": null,
    "value": "Sí",
    "enabled": true
  },
  "children": [
    {
      "id": "grid_beneficiarios",
      "type": "grid",
      "label": "Lista de Beneficiarios",
      "formDataGridId": "md_grid_001",
      "columns": [
        {
          "id": "col_pais",
          "label": "País",
          "type": "select",
          "required": true,
          "formDataGridColumnId": "col_001",
          "formDataOptions": [
            { "value": "Chile", "formDataOptionId": "opt_col_001_1" },
            { "value": "Argentina", "formDataOptionId": "opt_col_001_2" }
          ]
        },
        {
          "id": "col_rut",
          "label": "RUT / N° Doc",
          "type": "text",
          "required": true,
          "formDataGridColumnId": "col_002"
        }
      ]
    }
  ]
}
```

---

## 🎯 Best Practices

### Diseño de Formularios

1. **Agrupar Campos Relacionados**: Usar secciones para organizar
2. **Campos Requeridos**: Marcar claramente con (*)
3. **Descripciones Claras**: Usar Markdown para formatear instrucciones
4. **Lógica Simple**: No anidar demasiadas condiciones
5. **Validación Temprana**: Configurar validaciones en el builder

### Uso de Datos Maestros

1. **Priorizar Maestros**: Usar campos del maestro cuando existan
2. **Consistencia**: No duplicar campos que ya están en el maestro
3. **Solicitar Nuevos**: Si falta un campo común, agregarlo al maestro

### Performance

1. **Limitar Campos por Formulario**: Máximo 50-60 campos
2. **Grillas Moderadas**: No más de 5-7 columnas por grid
3. **Lógica Condicional**: Evitar cadenas largas de dependencias

---

## 🐛 Troubleshooting

### Problema: Campo no se puede editar

**Causa**: El campo viene del maestro  
**Solución**: Verificar que `formDataId` sea `null`, no un string

### Problema: Lógica condicional no funciona

**Causa**: `triggerId` incorrecto  
**Solución**: Verificar que el ID existe en el formulario

### Problema: Grid sin columnas

**Causa**: Grid del maestro eliminado  
**Solución**: Revisar integridad de datos maestros

---

## 📚 Referencias

- **Tipos TypeScript**: `src/types/index.ts`
- **Datos Maestros**: `src/data/mockMasterData.ts`
- **Hook Principal**: `src/hooks/useFormBuilder.ts`
- **Arquitectura General**: `ARCHITECTURE.md`

---

## 🔄 Changelog

### v1.0.0 (2026-01-04)
- ✅ Sistema dual de referencias (local + maestro)
- ✅ Soporte para grids del maestro con columnas
- ✅ Opciones con `formDataOptionId`
- ✅ Lógica condicional con `triggerFormDataId`
- ✅ Validaciones robustas (null vs string)

---

**Última actualización**: 2026-01-04  
**Autor**: Equipo Finnerve  
**Versión**: 1.0.0
