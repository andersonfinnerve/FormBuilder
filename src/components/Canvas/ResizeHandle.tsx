import React from 'react';
import { FormField } from '../../types';

interface ResizeHandleProps {
  field: FormField;
  isSelected: boolean;
  isSection: boolean;
  onUpdateWidth: (id: string, width: 'full' | 'half') => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ field, isSelected, isSection, onUpdateWidth }) => {
  if (!isSelected || field.type === 'divider' || isSection) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWidth = field.width === 'full' ? 'half' : 'full';
    onUpdateWidth(field.componentId, newWidth);
  };

  return (
    <div 
      className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 bg-surface-dark border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-md z-20 hover:scale-110 transition-all"
      onClick={handleClick}
    >
      <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
    </div>
  );
};

export default ResizeHandle;
