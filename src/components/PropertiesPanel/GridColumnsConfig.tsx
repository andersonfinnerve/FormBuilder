import React from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '../../types';

interface GridColumnsConfigProps {
  field: FormField;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (key: keyof FormField, value: any) => void;
}

const GridColumnsConfig: React.FC<GridColumnsConfigProps> = ({ field, sharedLibrary, onChange }) => {
  const handleColumnAdd = () => {
    const newCol: GridColumn = {
      id: Date.now().toString(),
      label: `Columna ${(field.columns?.length || 0) + 1}`,
      type: 'text',
      required: false
    };
    const newColumns = [...(field.columns || []), newCol];
    onChange('columns', newColumns);
  };

  const handleColumnRemove = (index: number) => {
    const newColumns = (field.columns || []).filter((_, i) => i !== index);
    onChange('columns', newColumns);
  };

  const handleColumnUpdate = (index: number, columnField: keyof GridColumn, val: any) => {
    const newColumns = [...(field.columns || [])];
    newColumns[index] = { ...newColumns[index], [columnField]: val };
    
    if (columnField === 'type' && val === 'select' && !newColumns[index].options && !newColumns[index].sharedSource) {
      newColumns[index].options = ['Opción A', 'Opción B'];
    }
    
    onChange('columns', newColumns);
  };

  const handleColumnOptionsChange = (index: number, val: string) => {
    const optionsArray = val.split(',').map(s => s.trim());
    handleColumnUpdate(index, 'options', optionsArray);
  };

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configurar Columnas</h4>
          <button 
            onClick={handleColumnAdd}
            className="text-primary text-xs font-bold hover:underline"
          >
            + Columna
          </button>
        </div>
        
        <div className="space-y-3">
          {field.columns?.map((col, index) => (
            <div key={col.id || index} className="bg-background-dark border border-border-dark rounded-lg p-3 space-y-3">
              {/* First Row: Name and Delete */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input 
                    className="w-full bg-transparent border-b border-border-dark text-white text-sm focus:border-primary outline-none px-0 py-1"
                    value={col.label}
                    placeholder="Nombre Columna"
                    onChange={(e) => handleColumnUpdate(index, 'label', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => handleColumnRemove(index)}
                  className="text-text-secondary hover:text-red-400"
                  title="Eliminar Columna"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              {/* Second Row: Type and Required */}
              <div className="flex items-center gap-3">
                <select 
                  className="flex-1 bg-surface-dark border border-border-dark rounded text-xs text-white px-2 py-1 outline-none focus:border-primary"
                  value={col.type}
                  onChange={(e) => handleColumnUpdate(index, 'type', e.target.value)}
                >
                  <option value="text">Texto</option>
                  <option value="select">Combo (Select)</option>
                </select>
                
                <label className="flex items-center gap-2 cursor-pointer" title="Marcar como requerido">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary w-4 h-4"
                    checked={col.required}
                    onChange={(e) => handleColumnUpdate(index, 'required', e.target.checked)}
                  />
                  <span className="text-xs text-text-secondary">Req.</span>
                </label>
              </div>

              {/* Third Row: Options (Only if type is select) */}
              {col.type === 'select' && (
                <div className="space-y-2 mt-2 border-t border-border-dark pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary uppercase font-bold">Origen de Opciones</label>
                    <select
                      className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1 text-xs text-white outline-none focus:border-primary"
                      value={col.sharedSource || 'manual'}
                      onChange={(e) => handleColumnUpdate(index, 'sharedSource', e.target.value === 'manual' ? undefined : e.target.value)}
                    >
                      <option value="manual">Manual (Escribir)</option>
                      <optgroup label="Librería Central">
                        {sharedLibrary.map(lib => (
                          <option key={lib.id} value={lib.id}>{lib.label}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {!col.sharedSource && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase font-bold">Opciones (separar por comas)</label>
                      <input 
                        className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1 text-xs text-white outline-none focus:border-primary"
                        value={col.options?.join(', ') || ''}
                        placeholder="Opción 1, Opción 2"
                        onChange={(e) => handleColumnOptionsChange(index, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GridColumnsConfig;
