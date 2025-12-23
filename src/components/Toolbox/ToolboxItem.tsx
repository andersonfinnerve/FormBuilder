import React from 'react';
import { FieldType } from '../../types';

interface ToolboxItemProps {
  icon: string;
  label: string;
  onClick: () => void;
  isShared?: boolean;
  type: FieldType;
  sharedId?: string;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ icon, label, onClick, isShared, type, sharedId }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/newFieldType", type);
    if (sharedId) {
      e.dataTransfer.setData("application/sharedId", sharedId);
    }
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`w-full group flex items-center gap-3 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:shadow-md text-left 
        ${isShared 
          ? 'bg-surface-dark border-border-dark hover:border-primary/50 hover:bg-background-dark' 
          : 'bg-background-dark border-border-dark hover:border-primary/50 hover:bg-background-dark/80'
        }`}
    >
      <div className={`transition-colors ${isShared ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="text-sm font-medium text-text-primary truncate select-none">{label}</span>
      {isShared && <span className="material-symbols-outlined ml-auto text-primary text-xs opacity-70" title="Campo Centralizado">link</span>}
      {!isShared && <span className="material-symbols-outlined ml-auto text-text-secondary opacity-0 group-hover:opacity-100 text-lg">add</span>}
    </div>
  );
};

export default ToolboxItem;
