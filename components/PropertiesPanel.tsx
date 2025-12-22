import React from 'react';
import { FormField, GridColumn, LogicRule, SharedFieldDefinition } from '../App';

interface PropertiesPanelProps {
  selectedField: FormField | null;
  allFields: FormField[]; 
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  sharedLibrary: SharedFieldDefinition[]; // Recibir librería
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedField, allFields, onUpdateField, sharedLibrary }) => {
  
  if (!selectedField) {
    return (
      <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex items-center justify-center text-text-secondary p-8 text-center">
        <div className="bg-background-dark p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-3xl">tune</span>
        </div>
        <h3 className="text-white font-bold mb-2">Sin selección</h3>
        <p className="text-sm">Selecciona un campo en el canvas para editar sus propiedades.</p>
      </aside>
    );
  }

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdateField(selectedField.id, key, value);
  };

  // --- Logic Handlers ---
  const handleLogicUpdate = (key: keyof LogicRule, value: any) => {
     const currentLogic = selectedField.logic || { triggerId: '', value: '', enabled: false };
     if (key === 'triggerId' && value !== currentLogic.triggerId) {
        onUpdateField(selectedField.id, 'logic', { ...currentLogic, triggerId: value, value: '' });
     } else {
        onUpdateField(selectedField.id, 'logic', { ...currentLogic, [key]: value });
     }
  };

  const toggleLogic = (enabled: boolean) => {
    const currentLogic = selectedField.logic || { triggerId: '', value: '', enabled: false };
    onUpdateField(selectedField.id, 'logic', { ...currentLogic, enabled });
  };

  // --- Grid Column Logic ---
  const handleColumnAdd = () => {
    const newCol: GridColumn = {
      id: Date.now().toString(),
      label: `Columna ${(selectedField.columns?.length || 0) + 1}`,
      type: 'text',
      required: false
    };
    const newColumns = [...(selectedField.columns || []), newCol];
    handleChange('columns', newColumns);
  };

  const handleColumnRemove = (index: number) => {
    const newColumns = (selectedField.columns || []).filter((_, i) => i !== index);
    handleChange('columns', newColumns);
  };

  const handleColumnUpdate = (index: number, field: keyof GridColumn, val: any) => {
    const newColumns = [...(selectedField.columns || [])];
    newColumns[index] = { ...newColumns[index], [field]: val };
    
    if (field === 'type' && val === 'select' && !newColumns[index].options && !newColumns[index].sharedSource) {
      newColumns[index].options = ['Opción A', 'Opción B'];
    }
    
    handleChange('columns', newColumns);
  };

  const handleColumnOptionsChange = (index: number, val: string) => {
    const optionsArray = val.split(',').map(s => s.trim());
    handleColumnUpdate(index, 'options', optionsArray);
  };

  const isLayoutField = selectedField.type === 'spacer' || selectedField.type === 'divider';
  const isShared = !!selectedField.sharedSource;

  const availableTriggers = allFields.filter(f => f.id !== selectedField.id && f.type !== 'spacer' && f.type !== 'divider' && f.type !== 'grid');
  const selectedTriggerField = availableTriggers.find(f => f.id === selectedField.logic?.triggerId);

  return (
    <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex">
      {/* Header */}
      <div className="p-5 border-b border-border-dark flex justify-between items-center">
        <h3 className="text-white font-bold text-sm">Propiedades</h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-medium uppercase">{selectedField.type}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        
        {/* Only show General Settings for non-layout fields */}
        {!isLayoutField && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configuración General</h4>
            {isShared && (
               <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20" title="Este campo está vinculado a una fuente de datos centralizada">
                  <span className="material-symbols-outlined text-xs">link</span>
                  <span className="text-[10px] font-bold uppercase">Vinculado</span>
               </div>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-white font-medium block">Etiqueta del Campo</label>
            <input 
              className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
              type="text" 
              value={selectedField.label}
              onChange={(e) => handleChange('label', e.target.value)}
            />
            {isShared && <p className="text-[10px] text-text-secondary">Puede renombrar la etiqueta localmente sin afectar la fuente.</p>}
          </div>
          
          {(selectedField.type === 'text' || selectedField.type === 'email' || selectedField.type === 'number' || selectedField.type === 'textarea') && (
            <div className="space-y-1.5">
              <label className="text-sm text-white font-medium block">Placeholder</label>
              <input 
                className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                type="text" 
                value={selectedField.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
               <label className="text-sm text-white font-medium block">Descripción / Ayuda</label>
               <span className="text-[10px] text-primary cursor-help" title="Use **negrita** para resaltar y [texto](url) para enlaces.">Soporta Markdown</span>
            </div>
            <textarea 
              className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none" 
              rows={4}
              value={selectedField.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ej. Ingrese aquí su **información** detallada."
            ></textarea>
          </div>
        </div>
        )}

        {/* File Specific Configuration */}
        {selectedField.type === 'file' && (
          <>
            <div className="h-px bg-border-dark w-full"></div>
            <div className="space-y-4">
               <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configuración de Carga</h4>
               
               <div className="space-y-2">
                 <label className="text-sm text-white font-medium block">Estilo Visual</label>
                 <div className="grid grid-cols-2 gap-2 bg-background-dark p-1 rounded-lg border border-border-dark">
                    <button 
                      onClick={() => handleChange('fileStyle', 'dropzone')}
                      className={`text-xs py-2 rounded transition-all ${(!selectedField.fileStyle || selectedField.fileStyle === 'dropzone') ? 'bg-surface-dark text-white shadow' : 'text-text-secondary hover:text-white'}`}
                    >
                      Zona de Arrastre
                    </button>
                    <button 
                      onClick={() => handleChange('fileStyle', 'button')}
                      className={`text-xs py-2 rounded transition-all ${selectedField.fileStyle === 'button' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-white'}`}
                    >
                      Botón de Acción
                    </button>
                 </div>
               </div>

               {selectedField.fileStyle === 'button' && (
                 <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-xs text-primary font-bold block">Enlace de Referencia (Ej. PDF Guía)</label>
                      <input 
                        className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                        type="text"
                        placeholder="https://..."
                        value={selectedField.downloadUrl || ''}
                        onChange={(e) => handleChange('downloadUrl', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-primary font-bold block">Texto del Enlace</label>
                      <input 
                        className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                        type="text"
                        placeholder="Ej. Descargar Documento W-9"
                        value={selectedField.downloadText || ''}
                        onChange={(e) => handleChange('downloadText', e.target.value)}
                      />
                    </div>
                 </div>
               )}
            </div>
          </>
        )}

        {/* Options Management (for top-level select/radio) */}
        {(selectedField.type === 'select' || selectedField.type === 'radio') && (
          <>
            <div className="h-px bg-border-dark w-full"></div>
            
            {/* If Shared, show READ ONLY message */}
            {isShared ? (
              <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex gap-3">
                 <span className="material-symbols-outlined text-primary">cloud_done</span>
                 <div>
                    <h4 className="text-white text-xs font-bold mb-1">Opciones Centralizadas</h4>
                    <p className="text-[10px] text-text-secondary leading-tight">
                       Las opciones de este campo provienen de una biblioteca compartida. No se pueden editar aquí para mantener la consistencia entre formularios.
                    </p>
                    <div className="mt-2 text-xs text-white opacity-60">
                       {selectedField.options?.length} opciones cargadas.
                    </div>
                 </div>
              </div>
            ) : (
              /* If NOT Shared, show Edit Controls */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Opciones</h4>
                  <button 
                    onClick={() => handleChange('options', [...(selectedField.options || []), 'Nueva Opción'])}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-1.5 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions[index] = e.target.value;
                          handleChange('options', newOptions);
                        }}
                      />
                      <button 
                        onClick={() => {
                           const newOptions = (selectedField.options || []).filter((_, i) => i !== index);
                           handleChange('options', newOptions);
                        }}
                        className="text-text-secondary hover:text-red-400"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Column Management (for Grid) */}
        {(selectedField.type === 'grid') && (
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
                {selectedField.columns?.map((col, index) => (
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
        )}


        {!isLayoutField && <div className="h-px bg-border-dark w-full"></div>}

        {/* Validation Settings */}
        {!isLayoutField && selectedField.type !== 'grid' && (
        <div className="space-y-4">
          <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Reglas</h4>
          
          <div className="flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">Campo Obligatorio</span>
              <span className="text-xs text-text-secondary">Requerido para enviar</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={selectedField.required}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
              <div className="w-11 h-6 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        )}

        {!isLayoutField && <div className="h-px bg-border-dark w-full"></div>}

        {/* Conditional Logic */}
        {!isLayoutField && (
        <div className="space-y-4">
           <div className="flex items-center justify-between group">
            <div className="flex flex-col">
              <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Lógica Condicional</h4>
              <span className="text-xs text-text-secondary">Mostrar/ocultar dinámicamente</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!selectedField.logic?.enabled}
                onChange={(e) => toggleLogic(e.target.checked)}
              />
              <div className="w-9 h-5 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {selectedField.logic?.enabled && (
             <div className="bg-background-dark/50 border border-border-dark rounded-lg p-3 space-y-3 animate-fadeIn">
                <div className="space-y-1">
                   <label className="text-xs text-white font-medium">Mostrar este campo cuando:</label>
                   <select 
                      className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                      value={selectedField.logic.triggerId || ''}
                      onChange={(e) => handleLogicUpdate('triggerId', e.target.value)}
                   >
                      <option value="">-- Seleccionar Campo --</option>
                      {availableTriggers.map(field => (
                         <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                   </select>
                </div>

                <div className="space-y-1">
                   <label className="text-xs text-white font-medium">Es igual a:</label>
                   {selectedTriggerField && (selectedTriggerField.type === 'select' || selectedTriggerField.type === 'radio') && selectedTriggerField.options ? (
                      <select 
                        className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                        value={selectedField.logic.value || ''}
                        onChange={(e) => handleLogicUpdate('value', e.target.value)}
                      >
                         <option value="">-- Seleccionar Valor --</option>
                         {selectedTriggerField.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                   ) : (
                      <input 
                         type="text"
                         className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                         placeholder="Valor esperado"
                         value={selectedField.logic.value || ''}
                         onChange={(e) => handleLogicUpdate('value', e.target.value)}
                      />
                   )}
                </div>
                
                {(!selectedField.logic.triggerId) && (
                   <p className="text-[10px] text-yellow-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      Seleccione un campo disparador.
                   </p>
                )}
             </div>
          )}
        </div>
        )}

        {!isLayoutField && <div className="h-px bg-border-dark w-full"></div>}

        {/* Appearance (Resizing) - Spacers can be resized, Dividers cannot */}
        {selectedField.type !== 'divider' && (
        <div className="space-y-4">
          <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Apariencia y Diseño</h4>
          <div className="space-y-2">
            <label className="text-sm text-white font-medium block">Ancho del Campo</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleChange('width', 'full')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedField.width === 'full' ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark bg-background-dark text-text-secondary hover:text-white'}`}
              >
                <div className="w-full h-2 bg-current rounded mb-2 opacity-50"></div>
                <span className="text-xs font-medium">100% (Ancho)</span>
              </button>
              <button 
                 onClick={() => handleChange('width', 'half')}
                 className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selectedField.width === 'half' ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark bg-background-dark text-text-secondary hover:text-white'}`}
              >
                <div className="flex gap-1 w-full mb-2">
                  <div className="w-1/2 h-2 bg-current rounded opacity-50"></div>
                  <div className="w-1/2 h-2 bg-border-dark rounded opacity-20"></div>
                </div>
                <span className="text-xs font-medium">50% (Columna)</span>
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Contextual Help */}
      <div className="p-4 bg-background-dark border-t border-border-dark m-4 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
          <div className="text-xs text-text-secondary leading-relaxed">
            <span className="text-white font-bold block mb-1">Tip de Diseño</span>
            {selectedField.type === 'spacer' 
              ? 'Usa el espaciador para crear huecos vacíos en filas de múltiples columnas.'
              : selectedField.type === 'file'
                 ? 'Usa el estilo "Botón de Acción" para secciones de documentación donde necesites proveer instrucciones largas o archivos descargables.'
                 : selectedField.logic?.enabled 
                   ? 'Los campos con lógica condicional solo aparecerán cuando el usuario seleccione la opción correcta en el campo disparador.'
                   : isShared
                    ? 'Los campos compartidos aseguran que datos críticos como la Nacionalidad se escriban igual en todos los formularios.'
                    : 'Usa el ancho completo para preguntas importantes o campos que requieren mucha lectura.'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;