import React from 'react';
import { DragOverPosition } from '@/types';

interface DragDropIndicatorsProps {
  dragOverPosition: DragOverPosition;
  isSection: boolean;
}

const DragDropIndicators: React.FC<DragDropIndicatorsProps> = ({ dragOverPosition, isSection }) => {
  return (
    <>
      {/* Drop Indicators */}
      {dragOverPosition === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-50 rounded-full shadow-[0_0_10px_rgba(37,140,244,0.8)] pointer-events-none"></div>
      )}
      {dragOverPosition === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary z-50 rounded-full shadow-[0_0_10px_rgba(37,140,244,0.8)] pointer-events-none"></div>
      )}
      {dragOverPosition === 'inside' && isSection && (
        <div className="absolute inset-0 border-2 border-primary bg-primary/5 rounded-lg z-40 pointer-events-none"></div>
      )}
    </>
  );
};

export default DragDropIndicators;
