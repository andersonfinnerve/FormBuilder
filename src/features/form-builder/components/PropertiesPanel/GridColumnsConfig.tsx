import React from 'react';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { FormField, GridColumn, SharedFieldDefinition } from '../../../../types';
import SubTitle from '../../../../shared/components/ui/SubTitle';
import { MASTER_DATA } from '../../../../core/services/mockMasterData';

interface GridColumnsConfigProps {
  field: FormField;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (key: keyof FormField, value: any) => void;
}

const GridColumnsConfig: React.FC<GridColumnsConfigProps> = ({ field, sharedLibrary, onChange }) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = React.useState(false);
  const fieldSettings: FormField = field;

  const isMasterDataGrid = typeof fieldSettings.FormDataGridId != null;
  console.log('isMasterDataGrid:', fieldSettings, isMasterDataGrid);


  const handleColumnAdd = () => {
    const newCol: GridColumn = {
      Id: Date.now().toString(),
      Label: `Columna ${(fieldSettings.Columns?.length || 0) + 1}`,
      Type: 'text',
      Required: false,
      FormDataGridColumnId: null // null = columna nueva
    };
    const newColumns = [...(fieldSettings.Columns || []), newCol];
    onChange('Columns', newColumns);
  };

  const handleAddMasterDataColumn = (masterDataId: number, masterDataType: string) => {
    // Buscar el dato maestro en mockMasterData
    const masterData = MASTER_DATA.find((md: any) => md.FormDataId === masterDataId);

    if (!masterData) return;

    const newCol: GridColumn = {
      Id: Date.now().toString(),
      Label: masterData.name,
      Type: masterDataType === 'registry' ? 'select' : 'text',
      Required: false,
      FormDataGridColumnId: masterDataId,
      Options: masterDataType === 'registry' && masterData.options
        ? masterData.options.map((opt: any) => ({
            DataOptionId: typeof opt === 'object' ? opt.id : undefined,
            TextValue: typeof opt === 'string' ? opt : opt.value
          }))
        : undefined
    };

    const newColumns = [...(fieldSettings.Columns || []), newCol];
    onChange('Columns', newColumns);
  };

  const handleColumnRemove = (index: number) => {
    const newColumns = (fieldSettings.Columns || []).filter((_, i) => i !== index);
    onChange('Columns', newColumns);
  };

  const handleColumnUpdate = (index: number, columnField: keyof GridColumn, val: any) => {
    const newColumns = [...(fieldSettings.Columns || [])];
    newColumns[index] = { ...newColumns[index], [columnField]: val };

    if (columnField === 'Type' && val === 'select' && !newColumns[index].Options && !newColumns[index].SharedSource) {
      newColumns[index].Options = [
        { DataOptionId: undefined, TextValue: 'Opción A' },
        { DataOptionId: undefined, TextValue: 'Opción B' }
      ];
    }

    onChange('Columns', newColumns);
  };

  const handleColumnOptionsChange = (index: number, val: string) => {
    const optionsArray = val.split(',').map(s => ({
      DataOptionId: undefined,
      TextValue: s.trim()
    }));
    handleColumnUpdate(index, 'Options', optionsArray);
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

    // Verificar si es un dato maestro
    const masterDataIdStr = e.dataTransfer.getData('application/masterDataId');
    const masterDataType = e.dataTransfer.getData('application/masterDataType');

    if (masterDataIdStr && masterDataType) {
      handleAddMasterDataColumn(parseInt(masterDataIdStr), masterDataType);
      return;
    }

    // Si no, es un reordenamiento de columnas existentes
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newColumns = [...(fieldSettings.Columns || [])];
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    onChange('Columns', newColumns);
    setDraggedIndex(null);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const masterDataId = e.dataTransfer.types.includes('application/masterdataid');
    if (masterDataId) {
      setIsDropZoneActive(true);
    }
  };

  const handleDropZoneDragLeave = () => {
    setIsDropZoneActive(false);
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);

    const masterDataIdStr = e.dataTransfer.getData('application/masterDataId');
    const masterDataType = e.dataTransfer.getData('application/masterDataType');

    if (masterDataIdStr && masterDataType) {
      handleAddMasterDataColumn(parseInt(masterDataIdStr), masterDataType);
    }
  };

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        {isMasterDataGrid ? (
          <>
            <div className="flex justify-between items-center">
              <SubTitle title="Configurar Columnas" />
              <div className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                <span className="material-symbols-outlined text-xs">database</span>
                <span className="text-[10px] font-bold uppercase">Maestro</span>
              </div>
            </div>
            <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex gap-3">
              <span className="material-symbols-outlined text-purple-400">database</span>
              <div>
                <h4 className="text-text-primary text-xs font-bold mb-1">Columnas del Dato Maestro</h4>
                <p className="text-[10px] text-text-secondary leading-tight mb-3">
                  Las columnas de esta grilla provienen del dato maestro del BackOffice. No se pueden editar aquí para mantener la integridad de los datos.
                </p>
                <div className="space-y-2">
                  {fieldSettings.Columns?.map((col, index) => (
                    <div key={col.Id || index} className="flex items-center gap-2 bg-surface-dark p-2 rounded border border-border-dark">
                      <span className="material-symbols-outlined text-sm text-text-secondary">
                        {col.Type === 'select' ? 'dns' : col.Type === 'file' ? 'cloud_upload' : 'short_text'}
                      </span>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-text-primary">{col.Label}</div>
                        <div className="text-[10px] text-text-secondary">
                          {col.Type === 'select' && col.Options ? `${col.Options.length} opciones` : col.Type}
                          {col.Required && ' • Requerido'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-text-primary opacity-60">
                  {fieldSettings.Columns?.length} columna{fieldSettings.Columns?.length !== 1 ? 's' : ''} cargada{fieldSettings.Columns?.length !== 1 ? 's' : ''} desde el maestro.
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <SubTitle title="Configurar Columnas" />
              <button
                onClick={handleColumnAdd}
                className="text-primary text-xs font-bold hover:underline"
              >
                + Columna
              </button>
            </div>
        {/* Zona de Drop para Datos Maestros */}
        <div
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={handleDropZoneDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
            isDropZoneActive
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-border-dark bg-background-dark/30'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className={`material-symbols-outlined text-2xl transition-colors ${
              isDropZoneActive ? 'text-primary' : 'text-text-secondary'
            }`}>
              {isDropZoneActive ? 'arrow_downward' : 'database'}
            </span>
            <p className={`text-xs font-medium transition-colors ${
              isDropZoneActive ? 'text-primary' : 'text-text-secondary'
            }`}>
              {isDropZoneActive
                ? 'Suelta aquí para agregar columna'
                : 'Arrastra Datos Maestros aquí para agregar columnas'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {fieldSettings.Columns?.map((col, index) => (
            <div
              key={col.Id || index}
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
                    value={col.Label}
                    placeholder="Nombre Columna"
                    onChange={(e) => handleColumnUpdate(index, 'Label', e.target.value)}
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
                  value={col.Type}
                  onChange={(e) => handleColumnUpdate(index, 'Type', e.target.value)}
                >
                  <option value="text">Texto</option>
                  <option value="select">Combo (Select)</option>
                  <option value="file">Subir Archivo</option>
                </Select>

                <label className="flex items-center gap-2 cursor-pointer bg-surface-dark border border-border-dark rounded px-2 py-1 h-full hover:border-primary transition-colors" title="Marcar como requerido">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary w-3.5 h-3.5"
                    checked={col.Required}
                    onChange={(e) => handleColumnUpdate(index, 'Required', e.target.checked)}
                  />
                  <span className="text-[10px] font-bold text-text-secondary uppercase">Req.</span>
                </label>
              </div>

              {/* Third Row: Options (Only if type is select) */}
              {col.Type === 'select' && (
                <div className="space-y-2 mt-2 border-t border-border-dark pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary uppercase font-bold">Origen de Opciones</label>
                    <Select
                      className="bg-surface-dark border-border-dark pl-2 pr-8 py-1 text-xs"
                      value={col.SharedSource || 'manual'}
                      onChange={(e) => handleColumnUpdate(index, 'SharedSource', e.target.value === 'manual' ? undefined : e.target.value)}
                    >
                      <option value="manual">Manual (Escribir)</option>
                      <optgroup label="Librería Central">
                        {sharedLibrary.map(lib => (
                          <option key={lib.Id} value={lib.Id}>{lib.Label}</option>
                        ))}
                      </optgroup>
                    </Select>
                  </div>

                  {!col.SharedSource && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary uppercase font-bold">Opciones (separar por comas)</label>
                      <Input
                        value={col.Options?.map(opt => opt.TextValue).join(', ') || ''}
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
          </>
        )}
      </div>
    </>
  );
};

export default GridColumnsConfig;
