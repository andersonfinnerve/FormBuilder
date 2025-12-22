import React, { useState } from 'react';
import { FormField, parseRichText, FieldType } from '../App';

interface CanvasProps {
  fields: FormField[];
  selectedId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string, e: React.MouseEvent) => void;
  onDuplicateField: (field: FormField, e: React.MouseEvent) => void;
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  onMoveField: (dragId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onDropNewField: (type: FieldType, targetId: string, position: 'before' | 'after' | 'inside', sharedId?: string) => void;
}

// Separate component for rendering individual fields to allow recursion
const FieldRenderer: React.FC<{
  field: FormField;
  props: CanvasProps;
}> = ({ field, props }) => {
  
  const { selectedId, onSelectField, onDeleteField, onDuplicateField, onUpdateField, onMoveField, onDropNewField } = props;
  const isSelected = selectedId === field.id;
  
  // State for drag visual feedback
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | 'inside' | null>(null);

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/fieldId", field.id);
    e.dataTransfer.effectAllowed = "move"; 
    e.stopPropagation(); // Prevent parent from also starting drag if nested
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    // Calculate position relative to the element
    const rect = e.currentTarget.getBoundingClientRect();
    const clientY = e.clientY;
    const height = rect.height;
    
    // If it's a section, allow dropping "inside" if hovering middle area
    if (field.type === 'section') {
       // Logic: Top 25% -> Before, Bottom 25% -> After, Middle 50% -> Inside
       const relativeY = clientY - rect.top;
       if (relativeY < height * 0.25) {
           setDragOverPosition('top');
       } else if (relativeY > height * 0.75) {
           setDragOverPosition('bottom');
       } else {
           setDragOverPosition('inside');
       }
    } else {
        // Standard fields: Top 50% -> Before, Bottom 50% -> After
        const relativeY = clientY - rect.top;
        if (relativeY < height / 2) {
            setDragOverPosition('top');
        } else {
            setDragOverPosition('bottom');
        }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
    
    // Determine Position
    let position: 'before' | 'after' | 'inside' = 'after';
    if (dragOverPosition === 'top') position = 'before';
    if (dragOverPosition === 'inside') position = 'inside';

    // Check if dropping a NEW field from Toolbox
    const newFieldType = e.dataTransfer.getData("application/newFieldType") as FieldType;
    if (newFieldType) {
        const sharedId = e.dataTransfer.getData("application/sharedId");
        onDropNewField(newFieldType, field.id, position, sharedId || undefined);
        return;
    }

    // Check if moving an EXISTING field
    const dragId = e.dataTransfer.getData("application/fieldId");
    if (dragId && dragId !== field.id) {
        onMoveField(dragId, field.id, position);
    }
  };

  const isSpacer = field.type === 'spacer';
  const isDivider = field.type === 'divider';
  const isSection = field.type === 'section';
  const isShared = !!field.sharedSource;
  const hasLogic = field.logic?.enabled && field.logic?.triggerId;
  const isButtonStyleFile = field.type === 'file' && field.fileStyle === 'button';

  // --- Render Content ---
  const renderInputContent = () => {
    const commonClasses = "w-full bg-background-dark border-border-dark rounded-lg px-4 py-2.5 text-white placeholder-gray-600 border focus:border-primary focus:ring-0 pointer-events-none";

    switch (field.type) {
      case 'section':
         return (
            <div className="mt-2 min-h-[50px]">
                {/* Recursive Rendering of Children */}
                {field.children && field.children.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {field.children.map((child, i) => (
                            <FieldRenderer 
                                key={child.id} 
                                field={child} 
                                props={props}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`border border-dashed rounded-lg p-6 text-center text-xs text-text-secondary transition-colors ${dragOverPosition === 'inside' ? 'bg-primary/20 border-primary' : 'border-gray-700 bg-black/20'}`}>
                        {dragOverPosition === 'inside' ? 'Soltar aquí para agregar' : 'Sección vacía. Arrastra campos aquí.'}
                    </div>
                )}
            </div>
         );

      case 'spacer':
        return (
          <div className="w-full h-12 border border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/20">
            <span className="text-xs text-text-secondary font-mono">Espacio Vacío ({field.width === 'full' ? '100%' : '50%'})</span>
          </div>
        );

      case 'divider':
        return <div className="py-2"><hr className="border-border-dark" /></div>;

      case 'grid':
        return (
          <div className="w-full overflow-hidden border border-border-dark rounded-lg">
             <div className="bg-surface-dark border-b border-border-dark px-4 py-2 text-xs text-text-secondary uppercase">Vista Previa Tabla</div>
             <div className="p-4 text-center text-xs text-text-secondary italic">Tabla configurada con {field.columns?.length || 0} columnas</div>
          </div>
        );
      
      case 'textarea':
        return <textarea className={commonClasses} placeholder={field.placeholder} rows={3} readOnly={field.readOnly} />;
      
      case 'select':
        return (
          <div className="relative">
            <select className={`${commonClasses} appearance-none`} disabled><option>Seleccionar opción...</option></select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-text-secondary pointer-events-none">expand_more</span>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3 p-2 border border-border-dark rounded-lg bg-background-dark">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-600 text-primary" disabled />
            <span className="text-white text-sm">{field.placeholder || 'Opción'}</span>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="radio" className="w-4 h-4 border-gray-600 text-primary" disabled />
                <span className="text-white text-sm">{opt}</span>
              </div>
            ))}
          </div>
        );

      case 'file':
        if (isButtonStyleFile) {
            return (
                <div className="space-y-4 pt-1">
                   {(field.description || field.downloadUrl) && (
                      <div className="text-sm text-text-secondary leading-relaxed">
                        {field.description && <div dangerouslySetInnerHTML={parseRichText(field.description)} />}
                        {field.downloadUrl && (
                           <div className="mt-2 text-primary font-bold inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-lg">description</span>
                              {field.downloadText || "Descargar documento adjunto"}
                           </div>
                        )}
                      </div>
                   )}
                   <button className="bg-green-600/90 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg opacity-90 pointer-events-none">
                      <span className="material-symbols-outlined">add</span>
                      Agregar archivo
                   </button>
                </div>
            );
        }
        return (
          <div className="border-2 border-dashed border-border-dark rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary bg-background-dark/50">
            <span className="material-symbols-outlined text-3xl mb-2">cloud_upload</span>
            <span className="text-xs">Haz clic o arrastra para subir</span>
          </div>
        );

      default: 
        return <input className={commonClasses} placeholder={field.placeholder} type={field.type} readOnly={field.readOnly} />;
    }
  };

  return (
    <div 
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
        className={`
            relative group rounded-lg transition-all cursor-grab active:cursor-grabbing
            ${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'}
            ${isSelected 
            ? 'ring-2 ring-primary bg-surface-dark shadow-xl z-10' 
            : isSection 
                ? 'border border-border-dark bg-background-dark/30 hover:border-primary/50' // Section Style
                : 'border border-transparent hover:border-border-dark hover:bg-background-dark' // Field Style
            }
            ${isSection ? 'p-6 md:p-8 my-2' : 'p-6'}
            ${isSpacer ? 'opacity-70 hover:opacity-100' : ''}
        `}
    >
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

        {/* Resize Handle */}
        {(isSelected && field.type !== 'divider' && !isSection) && (
            <div 
            className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 bg-surface-dark border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-md z-20 hover:scale-110 transition-all"
            onClick={(e) => {
                e.stopPropagation();
                const newWidth = field.width === 'full' ? 'half' : 'full';
                onUpdateField(field.id, 'width', newWidth);
            }}
            >
                <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            </div>
        )}
        
        {/* Actions */}
        <div className={`absolute right-2 top-2 flex gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} z-20`}>
            <div className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-white p-1 mr-1" title="Arrastrar para mover">
                <span className="material-symbols-outlined text-lg">drag_indicator</span>
            </div>
            <button onClick={(e) => onDuplicateField(field, e)} className="text-text-secondary hover:text-white hover:bg-primary rounded p-1 transition-colors">
            <span className="material-symbols-outlined text-lg">content_copy</span>
            </button>
            <button onClick={(e) => onDeleteField(field.id, e)} className="text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded p-1 transition-colors">
            <span className="material-symbols-outlined text-lg">delete</span>
            </button>
        </div>

        {/* Indicators */}
        <div className="absolute left-2 top-2 z-10 pointer-events-none flex flex-col gap-1">
            {isShared && <div title="Campo Compartido"><span className="material-symbols-outlined text-primary text-lg">link</span></div>}
            {hasLogic && <div title="Visibilidad Condicional" className="text-amber-400"><span className="material-symbols-outlined text-lg">alt_route</span></div>}
            {isSection && <div title="Sección / Grupo" className="text-text-secondary"><span className="material-symbols-outlined text-lg">ad_group</span></div>}
        </div>

        {/* Field Body */}
        <div className="space-y-2 pointer-events-auto"> 
            {!isSpacer && !isDivider && (
            <div className="flex flex-col gap-1 mb-2">
                <label 
                    className={`block text-sm font-bold transition-colors ${isSection ? 'text-lg uppercase tracking-wide border-b border-border-dark pb-2 mb-2' : ''} ${isButtonStyleFile ? 'uppercase tracking-wide text-text-secondary' : ''}`} 
                    style={{ color: isSelected && !isButtonStyleFile && !isSection ? '#258cf4' : (isSection ? 'white' : (isButtonStyleFile ? undefined : 'white')) }}
                >
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {/* Description for Sections appears below title but above children */}
                {isSection && field.description && (
                    <div className="text-sm text-text-secondary mb-4" dangerouslySetInnerHTML={parseRichText(field.description)} />
                )}
            </div>
            )}
            
            {renderInputContent()}

            {/* Description for normal fields */}
            {field.description && !isSpacer && !isDivider && !isButtonStyleFile && !isSection && (
            <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(field.description)} />
            )}
        </div>
    </div>
  );
};

// Main Canvas Component
const Canvas: React.FC<CanvasProps> = (props) => {
  const { fields, onSelectField, onDropNewField } = props;

  // Root level drop handler
  const handleRootDrop = (e: React.DragEvent) => {
      e.preventDefault();
      
      // Check if it's a new field
      const newFieldType = e.dataTransfer.getData("application/newFieldType") as FieldType;
      if (newFieldType) {
         if (e.target === e.currentTarget) {
            const lastField = fields[fields.length - 1];
            // If empty canvas, ID is not strictly needed by logic but passed for consistency, logic handles 'append' if target doesn't exist well or we can handle in App.
            // Using a dummy ID or the last field ID to append 'after'.
            const targetId = lastField ? lastField.id : 'ROOT_START'; 
            const sharedId = e.dataTransfer.getData("application/sharedId");
            
            onDropNewField(newFieldType, targetId, 'after', sharedId || undefined);
         }
         return;
      }

      // Check if it's a move
      const dragId = e.dataTransfer.getData("application/fieldId");
      if (!dragId) return;

      if (e.target === e.currentTarget) {
           const lastField = fields[fields.length - 1];
           if (lastField) {
               props.onMoveField(dragId, lastField.id, 'after');
           }
      }
  };

  return (
    <section 
        className="flex-1 bg-background-dark relative overflow-hidden flex flex-col" 
        onClick={() => onSelectField('')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleRootDrop}
    >
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-surface-dark border border-border-dark rounded-lg p-1 flex gap-1 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button className="p-2 text-text-secondary hover:text-white hover:bg-border-dark rounded transition-colors" title="Deshacer"><span className="material-symbols-outlined text-lg">undo</span></button>
        <button className="p-2 text-text-secondary hover:text-white hover:bg-border-dark rounded transition-colors" title="Rehacer"><span className="material-symbols-outlined text-lg">redo</span></button>
        <div className="w-px bg-border-dark my-1"></div>
        <button className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Limpiar Canvas"><span className="material-symbols-outlined text-lg">delete_sweep</span></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center custom-scrollbar">
        <div 
          className="w-full max-w-[900px] h-fit bg-surface-dark border border-border-dark rounded-xl shadow-2xl relative transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-3 w-full bg-gradient-to-r from-blue-600 via-primary to-cyan-400 rounded-t-xl"></div>
          
          <div className="p-6 md:p-10 space-y-8">
            <div className="group relative border-b border-border-dark pb-6 hover:bg-background-dark/30 -mx-4 px-4 rounded-lg transition-colors cursor-pointer">
              <h1 className="text-3xl font-bold text-white mb-2">Formulario de Registro #1024</h1>
              <p className="text-text-secondary">Complete la información solicitada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px] content-start">
              {fields.map((field) => (
                <FieldRenderer 
                    key={field.id} 
                    field={field} 
                    props={props} // Pass all props down
                />
              ))}

              {fields.length === 0 && (
                <div className="md:col-span-2 h-48 border-2 border-dashed border-border-dark rounded-lg flex flex-col items-center justify-center text-text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2">post_add</span>
                  <p>Arrastra elementos aquí para comenzar</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-border-dark bg-background-dark/30 rounded-b-xl flex justify-between items-center">
            <div className="text-xs text-text-secondary">Desarrollado por FormBuilder Pro</div>
            <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg opacity-50 cursor-not-allowed">Enviar</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Canvas;