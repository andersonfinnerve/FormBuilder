import React from 'react';
import { MasterData } from '../../types/masterData';

interface MasterDataItemProps {
  data: MasterData;
  onClick: () => void;
}

const MasterDataItem: React.FC<MasterDataItemProps> = ({ data, onClick }) => {
  const isRegistry = data.type === 'registry';
  const isGrid = data.type === 'grid';
  
  const icon = isGrid ? 'table_chart' : isRegistry ? 'dns' : 'short_text';
  const badgeColor = isGrid 
    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    : isRegistry 
      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
      : 'bg-green-500/20 text-green-400 border-green-500/30';
  const typeLabel = isGrid ? 'Grilla' : isRegistry ? 'Registro' : 'Texto';
  
  const subtitle = isGrid
    ? `${data.columns?.length || 0} columnas`
    : isRegistry 
      ? `${Array.isArray(data.options) ? data.options.length : 0} opciones` 
      : data.maxLength 
        ? `Máx ${data.maxLength} chars` 
        : 'Texto libre';

  const handleDragStart = (e: React.DragEvent) => {
    // Solo permitir arrastrar datos maestros de tipo texto o registro (no grillas completas)
    if (data.type !== 'grid') {
      e.dataTransfer.setData('application/masterDataId', data.FormDataId.toString());
      e.dataTransfer.setData('application/masterDataType', data.type);
      e.dataTransfer.effectAllowed = 'copy';
    } else {
      e.preventDefault();
    }
  };

  return (
    <div
      onClick={onClick}
      draggable={data.type !== 'grid'}
      onDragStart={handleDragStart}
      className="group flex items-start gap-2 p-2 rounded-lg bg-background-dark hover:bg-primary/10 border border-border-dark hover:border-primary/40 cursor-pointer transition-all"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-surface-dark text-text-secondary group-hover:text-primary transition-colors shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-base">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-text-primary group-hover:text-primary truncate transition-colors">
            {data.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
            {typeLabel}
          </span>
          <span className="text-[10px] text-text-secondary">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MasterDataItem;
