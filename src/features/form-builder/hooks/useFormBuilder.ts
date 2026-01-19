import { useState } from 'react';
import { FormField, FieldType, SharedFieldDefinition, FormConfig } from '@/types';
import { useHistory } from '@/hooks';
import {
  findFieldRecursive,
  updateFieldRecursive,
  deleteFieldRecursive,
  addFieldToParentRecursive,
  removeNode,
  insertNode
} from '@/shared/utils';

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_FORM_CONFIG: FormConfig = {
  Title: 'Formulario de Registro',
  Description: 'Complete la información solicitada.'
};

const FIELD_LABELS: Record<FieldType, string> = {
  text: 'Texto Corto',
  textarea: 'Párrafo',
  number: 'Número',
  email: 'Correo Electrónico',
  checkbox: 'Casilla',
  radio: 'Opción Única',
  select: 'Lista Desplegable',
  date: 'Fecha',
  file: 'Archivo',
  grid: 'Grilla de Datos',
  section: 'Nueva Sección',
  spacer: 'Espaciador',
  divider: 'Separador'
};

const DEFAULT_GRID_COLUMNS = [
  { Id: 'c1', Label: 'Item', Type: 'text' as const, Required: true, FormDataGridColumnId: null },
  { Id: 'c2', Label: 'Cantidad', Type: 'text' as const, Required: true, FormDataGridColumnId: null }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Genera un ID único para componentes
 */
const generateComponentId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Determina si un tipo de campo requiere opciones
 */
const requiresOptions = (type: FieldType): boolean => {
  return type === 'select' || type === 'radio';
};

/**
 * Determina si un tipo de campo NO debe tener FormDataId
 */
const shouldSkipFormDataId = (type: FieldType): boolean => {
  return type === 'grid' || type === 'section' || type === 'spacer' || type === 'divider';
};

// ==========================================
// FIELD CREATORS
// ==========================================

/**
 * Crea un campo desde una definición compartida
 */
const createSharedField = (sharedDef: SharedFieldDefinition): FormField => ({
  ComponentId: generateComponentId(),
  Type: sharedDef.Type,
  Label: sharedDef.Label,
  Placeholder: 'Seleccione una opción...',
  Required: false,
  ReadOnly: false,
  Order: 0,
  Width: 'full',
  Options: [...sharedDef.Options],
  SharedSource: sharedDef.Id
});

/**
 * Crea un campo base con configuración por defecto
 */
const createBaseField = (type: FieldType, label: string): FormField => {
  const baseField: FormField = {
    ComponentId: generateComponentId(),
    Type: type,
    Label: label,
    Placeholder: '',
    Required: false,
    ReadOnly: false,
    Order: 0,
    Width: 'full',
    Options: requiresOptions(type) ? [
      { DataOptionId: undefined, TextValue: 'Opción 1' },
      { DataOptionId: undefined, TextValue: 'Opción 2' }
    ] : undefined,
    FormDataId: shouldSkipFormDataId(type) ? undefined : null,
    FormDataGridId: type === 'grid' ? null : undefined,
    FileStyle: type === 'file' ? 'dropzone' : undefined,
    Children: type === 'section' ? [] : undefined,
    Columns: type === 'grid' ? DEFAULT_GRID_COLUMNS : undefined
  };

  // Configuración especial para spacer
  if (type === 'spacer') {
    baseField.Width = 'half';
    baseField.Label = 'Espaciador';
  }

  return baseField;
};

/**
 * Crea un campo de tipo grid desde datos maestros
 */
const createMasterGridField = (data: any): FormField => ({
  ComponentId: generateComponentId(),
  Type: 'grid',
  Label: data.name,
  Required: false,
  ReadOnly: false,
  Order: 0,
  Width: 'full',
  FormDataGridId: data.FormDataId,
  Description: data.description,
  Columns: data.columns?.map((col: any) => ({
    Id: col.FormDataGridColumnId.toString(),
    Label: col.label,
    Type: col.type,
    Required: col.required,
    FormDataGridColumnId: col.FormDataGridColumnId,
    Options: col.options?.map((opt: any) => ({
      DataOptionId: opt.DataOptionId,
      TextValue: opt.value
    }))
  })) || []
});

/**
 * Crea un campo de tipo select desde datos maestros
 */
const createMasterSelectField = (data: any): FormField => {
  const options = Array.isArray(data.options) && typeof data.options[0] === 'object'
    ? data.options.map((opt: any) => ({
        DataOptionId: opt.DataOptionId,
        TextValue: opt.value
      }))
    : data.options.map((opt: any) => ({
        DataOptionId: undefined,
        TextValue: opt
      }));

  return {
    ComponentId: generateComponentId(),
    Type: 'select',
    Label: data.name,
    Placeholder: 'Seleccione una opción...',
    Required: false,
    ReadOnly: false,
    Order: 0,
    Width: 'full',
    Options: options,
    FormDataId: data.FormDataId,
    Description: data.description
  };
};

/**
 * Crea un campo de texto desde datos maestros
 */
const createMasterTextField = (data: any): FormField => ({
  ComponentId: generateComponentId(),
  Type: 'text',
  Label: data.name,
  Placeholder: '',
  Required: false,
  ReadOnly: false,
  Order: 0,
  Width: 'full',
  FormDataId: data.FormDataId,
  Description: data.description
});

/**
 * Clona recursivamente los children de un campo con nuevos IDs
 */
const cloneChildrenRecursive = (children?: FormField[]): FormField[] | undefined => {
  if (!children || children.length === 0) return undefined;
  
  return children.map(child => ({
    ...child,
    ComponentId: generateComponentId(),
    Children: cloneChildrenRecursive(child.Children)
  }));
};

// ==========================================
// MAIN HOOK
// ==========================================

export const useFormBuilder = (
  initialFields: FormField[], 
  sharedLibrary: SharedFieldDefinition[], 
  initialConfig?: FormConfig
) => {
  // ==========================================
  // STATE
  // ==========================================
  
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [formConfig, setFormConfig] = useState<FormConfig>(initialConfig || DEFAULT_FORM_CONFIG);

  const {
    history,
    currentIndex,
    pushSnapshot,
    undo,
    redo,
    jumpToVersion,
    canUndo,
    canRedo
  } = useHistory(initialFields);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const selectedField: FormField | null = selectedId 
    ? findFieldRecursive(fields, selectedId) 
    : null;

  // ==========================================
  // UTILITIES
  // ==========================================

  /**
   * Actualiza los campos y guarda en el historial
   */
  const updateFieldsWithHistory = (newFields: FormField[], description: string) => {
    setFields(newFields);
    pushSnapshot(newFields, description);
  };

  /**
   * Añade un campo a la posición correcta (root o section seleccionada)
   */
  const addFieldToCorrectPosition = (newField: FormField): FormField[] => {
    if (selectedField && selectedField.Type === 'section') {
      return addFieldToParentRecursive(fields, selectedField.ComponentId, newField);
    }
    return [...fields, newField];
  };

  /**
   * Crea un objeto de campo basado en el tipo y definiciones
   */
  const createFieldObject = (
    type: FieldType, 
    label: string, 
    sharedDef?: SharedFieldDefinition
  ): FormField => {
    return sharedDef 
      ? createSharedField(sharedDef) 
      : createBaseField(type, label);
  };

  // ==========================================
  // HISTORY HANDLERS
  // ==========================================

  const handleUndo = () => {
    const previousFields = undo();
    if (previousFields) setFields(previousFields);
  };

  const handleRedo = () => {
    const nextFields = redo();
    if (nextFields) setFields(nextFields);
  };

  const handleJumpToVersion = (index: number) => {
    const versionFields = jumpToVersion(index);
    if (versionFields) setFields(versionFields);
  };

  // ==========================================
  // FORM CONFIG HANDLERS
  // ==========================================

  const handleUpdateFormConfig = (key: keyof FormConfig, value: string) => {
    setFormConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLoadForm = (loadedFields: FormField[], loadedConfig?: FormConfig) => {
    setFields(loadedFields);
    if (loadedConfig) setFormConfig(loadedConfig);
    pushSnapshot(loadedFields, 'Formulario cargado');
    setSelectedId(null);
  };

  // ==========================================
  // FIELD ADDITION HANDLERS
  // ==========================================

  const handleAddField = (type: FieldType, label: string) => {
    const newField = createFieldObject(type, label);
    const newFields = addFieldToCorrectPosition(newField);
    
    updateFieldsWithHistory(newFields, `Agregar campo: ${label}`);
    setSelectedId(newField.ComponentId);
  };

  const handleAddSharedField = (sharedDef: SharedFieldDefinition) => {
    const newField = createFieldObject(sharedDef.Type, sharedDef.Label, sharedDef);
    const newFields = addFieldToCorrectPosition(newField);
    
    updateFieldsWithHistory(newFields, `Agregar campo compartido: ${sharedDef.Label}`);
    setSelectedId(newField.ComponentId);
  };

  const handleAddMasterData = (data: any) => {
    let newField: FormField;

    if (data.type === 'grid') {
      newField = createMasterGridField(data);
    } else if (data.type === 'registry') {
      newField = createMasterSelectField(data);
    } else {
      newField = createMasterTextField(data);
    }

    const newFields = addFieldToCorrectPosition(newField);
    updateFieldsWithHistory(newFields, `Agregar dato maestro: ${data.name}`);
    setSelectedId(newField.ComponentId);
  };

  const handleDropNewField = (
    type: FieldType, 
    targetId: string, 
    position: 'before' | 'after' | 'inside', 
    sharedId?: string
  ) => {
    const sharedDef = sharedId 
      ? sharedLibrary.find(s => s.Id === sharedId) 
      : undefined;
    
    const label = sharedDef?.Label || FIELD_LABELS[type] || 'Nuevo Campo';
    const newField = createFieldObject(type, label, sharedDef);
    const updatedTree = insertNode(fields, targetId, newField, position);

    updateFieldsWithHistory(updatedTree, `Agregar campo: ${label}`);
    setSelectedId(newField.ComponentId);
  };

  // ==========================================
  // FIELD UPDATE HANDLERS
  // ==========================================

  const handleUpdateField = (id: string, key: keyof FormField, value: any) => {
    const newFields = updateFieldRecursive(fields, id, key, value);
    
    // Solo actualizar historial para cambios significativos (no texto en tiempo real)
    const isTextInput = key === 'Label' || key === 'Placeholder' || key === 'Description';
    
    if (isTextInput) {
      // Para inputs de texto, solo actualizar el estado (historial se guarda en onBlur)
      setFields(newFields);
    } else {
      // Para otros cambios, guardar en historial inmediatamente
      updateFieldsWithHistory(newFields, `Actualizar campo: ${String(key)}`);
    }
  };

  const handleCommitUpdate = (id: string, key: keyof FormField, value: any) => {
    const newFields = updateFieldRecursive(fields, id, key, value);
    updateFieldsWithHistory(newFields, `Actualizar ${String(key)}`);
  };

  // ==========================================
  // FIELD MANIPULATION HANDLERS
  // ==========================================

  const handleDeleteField = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    
    const newFields = deleteFieldRecursive(fields, id);
    updateFieldsWithHistory(newFields, 'Eliminar campo');
    
    if (selectedId === id) setSelectedId(null);
  };

  const handleDuplicateField = (field: FormField, e: MouseEvent) => {
    e.stopPropagation();

    const duplicatedField: FormField = {
      ...field,
      ComponentId: generateComponentId(),
      Label: field.Label + ' (Copia)',
      Children: cloneChildrenRecursive(field.Children)
    };

    const newFields = [...fields, duplicatedField];
    updateFieldsWithHistory(newFields, `Duplicar campo: ${field.Label}`);
  };

  const handleMoveField = (
    dragId: string, 
    targetId: string, 
    position: 'before' | 'after' | 'inside'
  ) => {
    if (dragId === targetId) return;
    
    const { node, newTree } = removeNode(fields, dragId);
    if (!node) return;
    
    const updatedTree = insertNode(newTree, targetId, node, position);
    updateFieldsWithHistory(updatedTree, 'Mover campo');
  };

  // ==========================================
  // RETURN API
  // ==========================================

  return {
    // State
    fields,
    selectedField,
    selectedId,
    setSelectedId,
    formConfig,
    
    // Form Config
    handleUpdateFormConfig,
    handleLoadForm,
    
    // Field Operations
    handleAddField,
    handleAddSharedField,
    handleAddMasterData,
    handleUpdateField,
    handleCommitUpdate,
    handleDeleteField,
    handleDuplicateField,
    handleMoveField,
    handleDropNewField,
    
    // History
    history,
    currentIndex,
    handleUndo,
    handleRedo,
    handleJumpToVersion,
    canUndo,
    canRedo
  };
};
