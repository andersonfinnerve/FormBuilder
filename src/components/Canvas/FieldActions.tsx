import React from 'react';
import { FormField } from '../../types';

interface FieldActionsProps {
  field: FormField;
  isSelected: boolean;
  onDuplicate: (field: FormField, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const FieldActions: React.FC<FieldActionsProps> = ({ field, isSelected, onDuplicate, onDelete }) => {
  return (
    <div className={`absolute right-2 top-2 flex gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} z-20`}>
      <div className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-white p-1 mr-1" title="Arrastrar para mover">
        <span className="material-symbols-outlined text-lg">drag_indicator</span>
      </div>
      <button onClick={(e) => onDuplicate(field, e)} className="text-text-secondary hover:text-white hover:bg-primary rounded p-1 transition-colors">
        <span className="material-symbols-outlined text-lg">content_copy</span>
      </button>
      <button onClick={(e) => onDelete(field.id, e)} className="text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded p-1 transition-colors">
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>
    </div>
  );
};

export default FieldActions;
