import { FormField, DropPosition } from '../types';

// Buscar un campo recursivamente en el árbol
export const findFieldRecursive = (fields: FormField[], id: string): FormField | null => {
  for (const field of fields) {
    if (field.componentId === id) return field;
    if (field.children) {
      const found = findFieldRecursive(field.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Actualizar un campo recursivamente
export const updateFieldRecursive = (
  fields: FormField[], 
  id: string, 
  key: keyof FormField, 
  value: any
): FormField[] => {
  return fields.map(field => {
    if (field.componentId === id) {
      return { ...field, [key]: value };
    }
    if (field.children) {
      return { ...field, children: updateFieldRecursive(field.children, id, key, value) };
    }
    return field;
  });
};

// Eliminar un campo recursivamente
export const deleteFieldRecursive = (fields: FormField[], id: string): FormField[] => {
  return fields.filter(field => field.componentId !== id).map(field => {
    if (field.children) {
      return { ...field, children: deleteFieldRecursive(field.children, id) };
    }
    return field;
  });
};

// Agregar campo a un padre (sección) recursivamente
export const addFieldToParentRecursive = (
  fields: FormField[], 
  parentId: string, 
  newField: FormField
): FormField[] => {
  return fields.map(field => {
    if (field.componentId === parentId) {
      // Si este es el padre (sección), agregamos al final de sus hijos
      return { ...field, children: [...(field.children || []), newField] };
    }
    if (field.children) {
      return { ...field, children: addFieldToParentRecursive(field.children, parentId, newField) };
    }
    return field;
  });
};

// Aplanar campos recursivamente (útil para selectores)
export const flattenFields = (fields: FormField[]): FormField[] => {
  return fields.reduce((acc, field) => {
    acc.push(field);
    if (field.children) {
      acc.push(...flattenFields(field.children));
    }
    return acc;
  }, [] as FormField[]);
};

// Remover un nodo del árbol y devolverlo
export const removeNode = (
  tree: FormField[], 
  id: string
): { node: FormField | null; newTree: FormField[] } => {
  let removedNode: FormField | null = null;

  const traverse = (items: FormField[]): FormField[] => {
    const result: FormField[] = [];
    for (const item of items) {
      if (item.componentId === id) {
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

// Insertar un nodo en una posición específica
export const insertNode = (
  tree: FormField[], 
  targetId: string, 
  nodeToInsert: FormField, 
  position: DropPosition
): FormField[] => {
  if (position === 'inside') {
    // Traverse to find the target section and push to its children
    return tree.map(item => {
      if (item.componentId === targetId) {
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
      if (item.componentId === targetId) {
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
