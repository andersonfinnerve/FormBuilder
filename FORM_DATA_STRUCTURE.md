# Estructura de Guardado de Datos del Formulario

Este documento describe cómo se guardan y cargan los datos del formulario siguiendo la estructura de `InitialFormStructure`.

## Estructura General

```typescript
{
  "FormId": number | null,
  "Name": string,
  "Description": string,
  "StructureForm": FormField[]
}
```

## Campos Normales

Los campos normales (text, select, etc.) guardan su valor en la propiedad `Value` con estructura `FormDataValue`:

```json
{
  "ComponentId": "1767710093975",
  "Type": "text",
  "Label": "Nombre",
  "FormDataId": 5,
  "DataId": 14,
  "Value": {
    "TextValue": "Anderson",
    "DataOptionId": null
  }
}
```

Para campos tipo `select`, el `DataOptionId` referencia la opción seleccionada del maestro:

```json
{
  "ComponentId": "question_1",
  "Type": "select",
  "FormDataId": 6,
  "DataId": 15,
  "Options": [
    { "DataOptionId": 17, "TextValue": "Si" },
    { "DataOptionId": 18, "TextValue": "No" }
  ],
  "Value": {
    "TextValue": "Si",
    "DataOptionId": 17
  }
}
```

## Campos de Tipo Grid

Los campos de tipo **grid** usan la propiedad `Values` (plural) con una estructura especial:

```json
{
  "ComponentId": "grid_beneficiarios",
  "Type": "grid",
  "FormDataGridId": 2,
  "DataGridId": 2,
  "Columns": [
    {
      "FormDataGridColumnId": 10,
      "DataGridColumnId": 10,
      "DataId": 17,
      "Label": "País",
      "Type": "select",
      "Required": true,
      "Options": [...]
    }
  ],
  "Values": [
    {
      "ContactFormDataGridRow": 7, // ID de la fila (null si es nueva)
      "ContactFormDataGridCell": [
        {
          "ContactFormDataGridCellId": 94, // ID de la celda (null si es nueva)
          "FormDataGridColumnId": 10, // Referencia a la columna
          "TextValue": "Argentina", // Valor de texto
          "DataOptionId": null // ID de la opción si es select
        },
        {
          "ContactFormDataGridCellId": 95,
          "FormDataGridColumnId": 11,
          "TextValue": "Chilena",
          "DataOptionId": null
        }
      ]
    },
    {
      "ContactFormDataGridRow": null, // Fila nueva
      "ContactFormDataGridCell": [
        {
          "ContactFormDataGridCellId": null, // Celda nueva
          "FormDataGridColumnId": 10,
          "TextValue": "Chile",
          "DataOptionId": null
        }
      ]
    }
  ]
}
```

## TypeScript Types

```typescript
// Value structure for normal fields
interface FormDataValue {
  TextValue: string;
  DataOptionId: number | null;
}

// Cell structure
interface ContactFormDataGridCell {
  ContactFormDataGridCellId: number | null;
  FormDataGridColumnId: number | null;
  TextValue: string;
  DataOptionId: number | null;
}

// Row structure
interface ContactFormDataGridRow {
  ContactFormDataGridRow: number | null;
  ContactFormDataGridCell: ContactFormDataGridCell[];
}

// Field interface
interface FormField {
  // ... other properties
  Value?: FormDataValue; // For normal fields - structure with TextValue and DataOptionId
  Values?: ContactFormDataGridRow[]; // For grid fields
}
```

## Flujo de Guardado

1. Usuario llena el formulario en Preview
2. Al hacer submit, el sistema:
   - Recorre todos los campos
   - Para campos normales: asigna `Value`
   - Para grids: convierte las filas a formato `Values` con estructura `ContactFormDataGridRow`
3. Guarda en LocalStorage manteniendo la estructura completa

## Flujo de Carga (Preload)

Para cargar datos existentes en el Preview:

```typescript
<PreviewModal
  fields={fields}
  formConfig={formConfig}
  onClose={handleClose}
  sharedLibrary={sharedLibrary}
  preloadedData={structureFormWithValues} // FormField[] con Values/Value poblados
/>
```

El sistema automáticamente:
1. Extrae los valores de `Value` y `Values`
2. Los convierte al formato interno del formulario
3. Renderiza el formulario con los datos precargados

## Ejemplo Completo

Ver archivo adjunto `submission-example.json` para un ejemplo completo de la estructura guardada.
