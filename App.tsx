import React, { useState } from 'react';
import Header from './components/Header';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';

// Tipos de datos para nuestra aplicación
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'select' | 'date' | 'file' | 'checkbox' | 'radio' | 'spacer' | 'divider' | 'grid' | 'section';

export interface GridColumn {
  id: string;
  label: string;
  type: 'text' | 'select';
  required: boolean;
  options?: string[]; // Solo si type es 'select' (Manual)
  sharedSource?: string; // ID de la librería compartida (Centralizado)
}

export interface LogicRule {
  triggerId: string;    // ID del campo que controla la visibilidad
  value: string;        // Valor que debe tener el trigger para mostrar este campo
  enabled: boolean;     // Si la regla está activa
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  readOnly: boolean;
  width: 'full' | 'half'; // Para redimensionar
  options?: string[]; // Para selects o radios (nivel campo)
  columns?: GridColumn[]; // Para grillas (nivel columna)
  sharedSource?: string; // ID del recurso compartido si proviene de la biblioteca central
  logic?: LogicRule; // Lógica condicional
  
  // Propiedades recursivas para secciones
  children?: FormField[];
  
  // Propiedades específicas para 'file'
  fileStyle?: 'dropzone' | 'button'; // Estilo visual de carga
  downloadUrl?: string; // URL para descargar documento plantilla (ej. W-9)
  downloadText?: string; // Texto del enlace de descarga
}

export interface SharedFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  options: string[];
}

// Utilidad para parsear texto enriquecido simple (Markdown básico)
export const parseRichText = (text: string | undefined) => {
  if (!text) return { __html: '' };
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline hover:text-blue-400 transition-colors font-medium">$1</a>');
  html = html.replace(/\n/g, '<br />');
  return { __html: html };
};

// Helpers Recursivos
const findFieldRecursive = (fields: FormField[], id: string): FormField | null => {
  for (const field of fields) {
    if (field.id === id) return field;
    if (field.children) {
      const found = findFieldRecursive(field.children, id);
      if (found) return found;
    }
  }
  return null;
};

const updateFieldRecursive = (fields: FormField[], id: string, key: keyof FormField, value: any): FormField[] => {
  return fields.map(field => {
    if (field.id === id) {
      return { ...field, [key]: value };
    }
    if (field.children) {
      return { ...field, children: updateFieldRecursive(field.children, id, key, value) };
    }
    return field;
  });
};

const deleteFieldRecursive = (fields: FormField[], id: string): FormField[] => {
  return fields.filter(field => field.id !== id).map(field => {
    if (field.children) {
      return { ...field, children: deleteFieldRecursive(field.children, id) };
    }
    return field;
  });
};

const addFieldToParentRecursive = (fields: FormField[], parentId: string, newField: FormField): FormField[] => {
  return fields.map(field => {
    if (field.id === parentId) {
      // Si este es el padre (sección), agregamos al final de sus hijos
      return { ...field, children: [...(field.children || []), newField] };
    }
    if (field.children) {
      return { ...field, children: addFieldToParentRecursive(field.children, parentId, newField) };
    }
    return field;
  });
};

// Helper para aplanar los campos y poder usarlos en selectores de lógica
const flattenFields = (fields: FormField[]): FormField[] => {
  return fields.reduce((acc, field) => {
    acc.push(field);
    if (field.children) {
      acc.push(...flattenFields(field.children));
    }
    return acc;
  }, [] as FormField[]);
};

// --- Logic for Drag and Drop (Deep Move) ---
// Finds a node and removes it from the tree, returning the node and the new tree
const removeNode = (tree: FormField[], id: string): { node: FormField | null; newTree: FormField[] } => {
  let removedNode: FormField | null = null;

  const traverse = (items: FormField[]): FormField[] => {
    const result: FormField[] = [];
    for (const item of items) {
      if (item.id === id) {
        removedNode = item;
        continue; // Skip adding this item to result (remove it)
      }
      if (item.children) {
        item.children = traverse(item.children);
      }
      result.push(item);
    }
    return result;
  };

  const newTree = traverse(tree);
  return { node: removedNode, newTree };
};

// Inserts a node relative to a targetId or inside it
const insertNode = (tree: FormField[], targetId: string, nodeToInsert: FormField, position: 'before' | 'after' | 'inside'): FormField[] => {
  if (position === 'inside') {
    // Traverse to find the target section and push to its children
    return tree.map(item => {
        if (item.id === targetId) {
            return { ...item, children: [...(item.children || []), nodeToInsert] };
        }
        if (item.children) {
            return { ...item, children: insertNode(item.children, targetId, nodeToInsert, position) };
        }
        return item;
    });
  }

  // Handle before/after
  const traverse = (items: FormField[]): FormField[] => {
    const result: FormField[] = [];
    for (const item of items) {
      if (item.id === targetId) {
        if (position === 'before') {
          result.push(nodeToInsert);
          result.push(item);
        } else {
          result.push(item);
          result.push(nodeToInsert);
        }
      } else {
        if (item.children) {
          item.children = traverse(item.children);
        }
        result.push(item);
      }
    }
    return result;
  };

  return traverse(tree);
};

// Simulación de base de datos centralizada
const sharedFieldsLibrary: SharedFieldDefinition[] = [
  {
    id: 'lib_nationality',
    label: 'Nacionalidad',
    type: 'select',
    options: ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'España', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Otro']
  },
  {
    id: 'lib_gender',
    label: 'Género',
    type: 'radio',
    options: ['Masculino', 'Femenino', 'No binario', 'Prefiero no decirlo']
  },
  {
    id: 'lib_currency',
    label: 'Moneda de Pago',
    type: 'select',
    options: ['USD - Dólar Estadounidense', 'EUR - Euro', 'MXN - Peso Mexicano', 'COP - Peso Colombiano', 'ARS - Peso Argentino']
  }
];

const initialFields: FormField[] = [
  {
    id: '1',
    type: 'text',
    label: 'Nombre Completo',
    placeholder: 'Ej. Juan Pérez',
    description: 'Ingrese su nombre legal como aparece en su ID.',
    required: true,
    readOnly: false,
    width: 'half',
  },
  {
    id: 'section_1',
    type: 'section',
    label: 'BENEFICIARIOS FINALES',
    description: '¿Existe alguna persona natural que pueda ser considerado como beneficiario final?',
    required: false,
    readOnly: false,
    width: 'full',
    children: [
        {
            id: 'sub_1',
            type: 'radio',
            label: '¿Con control efectivo según circular N 57/2017?',
            options: ['Sí', 'No'],
            required: true,
            readOnly: false,
            width: 'full'
        },
        {
            id: 'inner_section_1',
            type: 'section',
            label: 'PARTICIPACIÓN IGUAL O MAYOR AL 10%',
            description: 'Personas naturales que tienen una participación en la persona o estructura jurídica declarante igual o mayor al 10%.',
            required: false,
            readOnly: false,
            width: 'full',
            // Lógica: Mostrar solo si 'sub_1' es 'Sí'
            logic: {
                triggerId: 'sub_1',
                value: 'Sí',
                enabled: true
            },
            children: [
                 {
                    id: 'grid_1',
                    type: 'grid',
                    label: 'Lista de Beneficiarios',
                    required: false,
                    readOnly: false,
                    width: 'full',
                    columns: [
                        { id: 'c1', label: 'País', type: 'select', required: true, sharedSource: 'lib_nationality' }, // Ejemplo usando librería
                        { id: 'c2', label: 'RUT / N Doc', type: 'text', required: true },
                        { id: 'c3', label: 'Nombre(s)', type: 'text', required: true }
                    ]
                 }
            ]
        }
    ]
  }
];

const App: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Encontrar el campo seleccionado actualmente (Recursivo)
  const selectedField = selectedId ? findFieldRecursive(fields, selectedId) : null;

  // Función Helper para crear objetos de campo
  const createFieldObject = (type: FieldType, label: string, sharedDef?: SharedFieldDefinition): FormField => {
      if (sharedDef) {
           return {
            id: Date.now().toString(),
            type: sharedDef.type,
            label: sharedDef.label,
            placeholder: 'Seleccione una opción...',
            required: false,
            readOnly: false,
            width: 'full',
            options: [...sharedDef.options],
            sharedSource: sharedDef.id
          };
      }

      const newField: FormField = {
        id: Date.now().toString(),
        type,
        label,
        placeholder: '',
        required: false,
        readOnly: false,
        width: 'full',
        options: type === 'select' || type === 'radio' ? ['Opción 1', 'Opción 2'] : undefined,
        fileStyle: type === 'file' ? 'dropzone' : undefined,
        children: type === 'section' ? [] : undefined,
        columns: type === 'grid' ? [
            { id: 'c1', label: 'Item', type: 'text', required: true },
            { id: 'c2', label: 'Cantidad', type: 'text', required: true },
        ] : undefined
      };
      
      if (type === 'spacer') {
          newField.width = 'half';
          newField.label = 'Espaciador';
      }

      return newField;
  };

  // Añadir nuevo campo (Click)
  const handleAddField = (type: FieldType, label: string) => {
    const newField = createFieldObject(type, label);

    // Si hay una sección seleccionada, agregamos DENTRO de ella
    if (selectedField && selectedField.type === 'section') {
        setFields(addFieldToParentRecursive(fields, selectedField.id, newField));
    } else {
        // Si no, agregamos al nivel raíz
        setFields([...fields, newField]);
    }
    
    setSelectedId(newField.id);
  };

  // Añadir campo compartido (Click)
  const handleAddSharedField = (sharedDef: SharedFieldDefinition) => {
    const newField = createFieldObject(sharedDef.type, sharedDef.label, sharedDef);
    
    if (selectedField && selectedField.type === 'section') {
        setFields(addFieldToParentRecursive(fields, selectedField.id, newField));
    } else {
        setFields([...fields, newField]);
    }
    setSelectedId(newField.id);
  };

  // Actualizar propiedad
  const handleUpdateField = (id: string, key: keyof FormField, value: any) => {
    setFields(updateFieldRecursive(fields, id, key, value));
  };

  // Eliminar campo
  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFields(deleteFieldRecursive(fields, id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  // Duplicar campo
  const handleDuplicateField = (field: FormField, e: React.MouseEvent) => {
    e.stopPropagation();
    const newField = { 
      ...field, 
      id: Date.now().toString(), 
      label: field.label + ' (Copia)',
      children: field.children ? [] : undefined 
    };
    
    setFields([...fields, newField]);
    setSelectedId(newField.id);
  };
  
  // Función de Movimiento (Drag & Drop Avanzado - Existente)
  const handleMoveField = (dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
      if (dragId === targetId) return;
      const { node, newTree } = removeNode(fields, dragId);
      if (!node) return;
      const updatedTree = insertNode(newTree, targetId, node, position);
      setFields(updatedTree);
  };

  // Función de Drop para NUEVOS campos (Toolbox -> Canvas)
  const handleDropNewField = (type: FieldType, targetId: string, position: 'before' | 'after' | 'inside', sharedId?: string) => {
      let sharedDef: SharedFieldDefinition | undefined;
      let label = type === 'section' ? 'Nueva Sección' : 'Nuevo Campo';

      // Configurar etiquetas y definiciones si es compartido
      if (sharedId) {
          sharedDef = sharedFieldsLibrary.find(s => s.id === sharedId);
          if (sharedDef) label = sharedDef.label;
      } else {
          // Mapeo simple de etiquetas por defecto
          const labels: Record<string, string> = {
              text: 'Texto Corto', textarea: 'Párrafo', number: 'Número', email: 'Correo Electrónico',
              checkbox: 'Casilla', radio: 'Opción Única', select: 'Lista Desplegable',
              date: 'Fecha', file: 'Archivo', grid: 'Grilla de Datos',
              section: 'Nueva Sección', spacer: 'Espaciador', divider: 'Separador'
          };
          if (labels[type]) label = labels[type];
      }

      const newField = createFieldObject(type, label, sharedDef);
      
      // Insertar en la posición deseada
      // Nota: No necesitamos 'removeNode' porque es nuevo
      const updatedTree = insertNode(fields, targetId, newField, position);
      
      setFields(updatedTree);
      setSelectedId(newField.id);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Header onPreview={() => setIsPreviewOpen(true)} />
      <main className="flex flex-1 overflow-hidden relative">
        <Toolbox 
          onAddField={handleAddField} 
          sharedLibrary={sharedFieldsLibrary}
          onAddSharedField={handleAddSharedField}
        />
        <Canvas 
          fields={fields} 
          selectedId={selectedId} 
          onSelectField={setSelectedId}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          onUpdateField={handleUpdateField}
          onMoveField={handleMoveField} 
          onDropNewField={handleDropNewField} // Nueva prop
        />
        <PropertiesPanel 
          selectedField={selectedField} 
          allFields={flattenFields(fields)}
          onUpdateField={handleUpdateField}
          sharedLibrary={sharedFieldsLibrary}
        />
      </main>

      {isPreviewOpen && (
        <PreviewModal 
          fields={fields} 
          onClose={() => setIsPreviewOpen(false)}
          sharedLibrary={sharedFieldsLibrary}
        />
      )}
    </div>
  );
};

export default App;