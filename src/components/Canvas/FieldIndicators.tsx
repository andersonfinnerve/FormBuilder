import React from 'react';

interface FieldIndicatorsProps {
  isShared: boolean;
  hasLogic: boolean;
  isSection: boolean;
}

const FieldIndicators: React.FC<FieldIndicatorsProps> = ({ isShared, hasLogic, isSection }) => {
  return (
    <div className="absolute left-2 top-2 z-10 pointer-events-none flex flex-col gap-1">
      {isShared && (
        <div title="Campo Compartido">
          <span className="material-symbols-outlined text-primary text-lg">link</span>
        </div>
      )}
      {hasLogic && (
        <div title="Visibilidad Condicional" className="text-amber-400">
          <span className="material-symbols-outlined text-lg">alt_route</span>
        </div>
      )}
      {isSection && (
        <div title="Sección / Grupo" className="text-text-secondary">
          <span className="material-symbols-outlined text-lg">ad_group</span>
        </div>
      )}
    </div>
  );
};

export default FieldIndicators;
