import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { FormField, GridColumn, SharedFieldDefinition } from '../../types';
import SubTitle from '../Toolbox/SubTitle';

interface GridColumnsConfigProps {
  field: FormField;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (key: keyof FormField, value: any) => void;
}

const GridColumnsConfig: React.FC<GridColumnsConfigProps> = ({ field, sharedLibrary, onChange }) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Evitar arrastrar si se interactúa con inputs
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newColumns = [...(field.columns || [])];
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);
    
    onChange('columns', newColumns);
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SubTitle title="Configurar Columnas" />
          <button 
            onClick={handleColumnAdd}
            className="text-primary text-xs font-bold hover:underline"
          >
            + Columna
          </button>
        </div>
        
        <div className="space-y-3">
          {field.columns?.map((col, index) => (
            <div 
              key={col.id || index} 
              className={`bg-background-dark border border-border-dark rounded-lg p-3 space-y-3 transition-all ${draggedIndex === index ? 'opacity-50 border-dashed border-primary' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => setDraggedIndex(null)}
            >
              {/* First Row: Name and Delete */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary cursor-move text-lg hover:text-text-primary" title="Arrastrar para ordenar">drag_indicator</span>
                <div className="flex-1">
                  <Input 
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
              <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                <Select 
                  className="w-full bg-surface-dark border-border-dark pl-2 pr-8 py-1 text-xs"
                  value={col.type}
                  onChange={(e) => handleColumnUpdate(index, 'type', e.target.value)}
                >
                  <option value="text">Texto</option>
                  <option value="select">Combo (Select)</option>
                  <option value="file">Subir Archivo</option>
                </Select>
                
                <label className="flex items-center gap-2 cursor-pointer bg-surface-dark border border-border-dark rounded px-2 py-1 h-full hover:border-primary transition-colors" title="Marcar como requerido">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary w-3.5 h-3.5"
                    checked={col.required}
                    onChange={(e) => handleColumnUpdate(index, 'required', e.target.checked)}
                  />
                  <span className="text-[10px] font-bold text-text-secondary uppercase">Req.</span>
                </label>
              </div>

              {/* Third Row: Options (Only if type is select) */}
              {col.type === 'select' && (
                <div className="space-y-2 mt-2 border-t border-border-dark pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary uppercase font-bold">Origen de Opciones</label>
                    <Select
                      className="bg-surface-dark border-border-dark pl-2 pr-8 py-1 text-xs"
                      value={col.sharedSource || 'manual'}
                      onChange={(e) => handleColumnUpdate(index, 'sharedSource', e.target.value === 'manual' ? undefined : e.target.value)}
                    >
                      <option value="manual">Manual (Escribir)</option>
                      <optgroup label="Librería Central">
                        {sharedLibrary.map(lib => (
                          <option key={lib.id} value={lib.id}>{lib.label}</option>
                        ))}
                      </optgroup>
                    </Select>
                  </div>

                  {!col.sharedSource && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase font-bold">Opciones (separar por comas)</label>
                      <Input 
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
