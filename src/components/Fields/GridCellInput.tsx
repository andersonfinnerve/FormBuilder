import React from 'react';
import { GridColumn, SharedFieldDefinition } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface GridCellInputProps {
  column: GridColumn;
  value: any;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (value: any) => void;
}

const GridCellInput: React.FC<GridCellInputProps> = ({
  column,
  value,
  sharedLibrary,
  onChange
}) => {
  let options = column.Options;
  if (column.SharedSource) {
    const sharedDef = sharedLibrary?.find(s => s.Id === column.SharedSource);
    if (sharedDef) {
      options = sharedDef.Options;
    }
  }

  if (column.Type === 'select') {
    return (
      <Select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="bg-transparent border-0 border-b border-transparent rounded-none focus:ring-0 focus:border-primary px-2 py-1"
      >
        <option value="">Seleccionar...</option>
        {options?.map((opt, i) => <option key={i} value={opt.TextValue}>{opt.TextValue}</option>)}
      </Select>
    );
  }

  if (column.Type === 'file') {
    return (
      <div className="flex items-center gap-2 min-w-[200px]">
        {value instanceof File ? (
          <>
            <div className="flex-1 flex items-center gap-2 overflow-hidden bg-surface bg-surface-dark px-2 py-1 rounded border border-border border-border-dark">
              <span className="material-symbols-outlined text-text-secondary text-lg">description</span>
              <span className="text-xs truncate max-w-[120px] text-text-primary " title={value.name}>{value.name}</span>
            </div>
            
            <a 
              href={URL.createObjectURL(value)} 
              download={value.name}
              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors flex items-center justify-center"
              title="Descargar archivo"
            >
              <span className="material-symbols-outlined text-lg">download</span>
            </a>

            <button 
              onClick={() => onChange(null)}
              className="p-1.5 text-red-500 hover:bg-red-50 hover:bg-red-900/20 rounded transition-colors flex items-center justify-center"
              title="Eliminar archivo"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </>
        ) : (
          <input 
            type="file" 
            className="block w-full text-xs text-text-secondary
              file:mr-2 file:py-1.5 file:px-3
              file:rounded-full file:border-0
              file:text-xs file:font-semibold
              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20
              cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <Input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-transparent border-0 border-b border-transparent rounded-none focus:ring-0 focus:border-primary px-2 py-1"
    />
  );
};

export default GridCellInput;
