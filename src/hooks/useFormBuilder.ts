import React, { useState } from 'react';
import { FormField, FieldType, SharedFieldDefinition } from '../types';
import {
  findFieldRecursive,
  updateFieldRecursive,
  deleteFieldRecursive,
  addFieldToParentRecursive,
  removeNode,
  insertNode
} from '../utils/fieldHelpers';

export const useFormBuilder = (initialFields: FormField[], sharedLibrary: SharedFieldDefinition[]) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>('1');

  const selectedField = selectedId ? findFieldRecursive(fields, selectedId) : null;

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

  const handleAddField = (type: FieldType, label: string) => {
    const newField = createFieldObject(type, label);

    if (selectedField && selectedField.type === 'section') {
      setFields(addFieldToParentRecursive(fields, selectedField.id, newField));
    } else {
      setFields([...fields, newField]);
    }
    
    setSelectedId(newField.id);
  };

  const handleAddSharedField = (sharedDef: SharedFieldDefinition) => {
    const newField = createFieldObject(sharedDef.type, sharedDef.label, sharedDef);
    
    if (selectedField && selectedField.type === 'section') {
      setFields(addFieldToParentRecursive(fields, selectedField.id, newField));
    } else {
      setFields([...fields, newField]);
    }
    setSelectedId(newField.id);
  };

  const handleUpdateField = (id: string, key: keyof FormField, value: any) => {
    setFields(updateFieldRecursive(fields, id, key, value));
  };

  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFields(deleteFieldRecursive(fields, id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

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

  const handleMoveField = (dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    if (dragId === targetId) return;
    const { node, newTree } = removeNode(fields, dragId);
    if (!node) return;
    const updatedTree = insertNode(newTree, targetId, node, position);
    setFields(updatedTree);
  };

  const handleDropNewField = (type: FieldType, targetId: string, position: 'before' | 'after' | 'inside', sharedId?: string) => {
    let sharedDef: SharedFieldDefinition | undefined;
    let label = type === 'section' ? 'Nueva Sección' : 'Nuevo Campo';

    if (sharedId) {
      sharedDef = sharedLibrary.find(s => s.id === sharedId);
      if (sharedDef) label = sharedDef.label;
    } else {
      const labels: Record<string, string> = {
        text: 'Texto Corto', textarea: 'Párrafo', number: 'Número', email: 'Correo Electrónico',
        checkbox: 'Casilla', radio: 'Opción Única', select: 'Lista Desplegable',
        date: 'Fecha', file: 'Archivo', grid: 'Grilla de Datos',
        section: 'Nueva Sección', spacer: 'Espaciador', divider: 'Separador'
      };
      if (labels[type]) label = labels[type];
    }

    const newField = createFieldObject(type, label, sharedDef);
    const updatedTree = insertNode(fields, targetId, newField, position);
    
    setFields(updatedTree);
    setSelectedId(newField.id);
  };

  return {
    fields,
    selectedField,
    selectedId,
    setSelectedId,
    handleAddField,
    handleAddSharedField,
    handleUpdateField,
    handleDeleteField,
    handleDuplicateField,
    handleMoveField,
    handleDropNewField
  };
};
