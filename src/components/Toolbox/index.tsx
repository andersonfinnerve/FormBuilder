import React from 'react';
import { FieldType, SharedFieldDefinition } from '../../types';
import { Input } from '../common/Input';
import ToolboxItem from './ToolboxItem';

interface ToolboxProps {
  onAddField: (type: FieldType, label: string) => void;
  sharedLibrary: SharedFieldDefinition[];
  onAddSharedField: (field: SharedFieldDefinition) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onAddField, sharedLibrary, onAddSharedField }) => {
  console.log('prueba 1')
  return (
    <aside className="w-72 bg-surface-dark border-r border-border-dark flex flex-col z-10 shrink-0 hidden lg:flex">
      {/* Search */}
      <div className="p-4 border-b border-border-dark">
        <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Caja de Herramientas</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-text-secondary text-lg z-10">search</span>
          <Input 
            className="bg-background-dark border-border-dark pl-9 placeholder-text-secondary" 
            placeholder="Buscar campos..." 
            type="text" 
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        
        {/* Category: Shared Fields */}
        {sharedLibrary && sharedLibrary.length > 0 && (
          <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-primary/20 p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">cloud_circle</span>
                Librería Central
              </h4>
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">{sharedLibrary.length}</span>
            </div>
            
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar pr-1 grid grid-cols-1 gap-2">
              {sharedLibrary.map((field) => (
                <ToolboxItem 
                  key={field.id}
                  type={field.type}
                  sharedId={field.id}
                  icon={field.type === 'select' ? 'dns' : 'radio_button_checked'} 
                  label={field.label} 
                  isShared={true}
                  onClick={() => onAddSharedField(field)} 
                />
              ))}
            </div>
            <div className="mt-2 text-[10px] text-primary/60 text-center font-medium">
              Deslice para ver más
            </div>
          </div>
        )}

        {sharedLibrary && sharedLibrary.length > 0 && <div className="h-px bg-border-dark w-full"></div>}

        {/* Category: Basic */}
        <div>
          <h4 className="text-text-primary font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-text-secondary text-base">check_box_outline_blank</span>
            Básicos
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <ToolboxItem type="text" icon="short_text" label="Texto Corto" onClick={() => onAddField('text', 'Texto Corto')} />
            <ToolboxItem type="textarea" icon="notes" label="Párrafo Largo" onClick={() => onAddField('textarea', 'Párrafo')} />
            <ToolboxItem type="number" icon="123" label="Número" onClick={() => onAddField('number', 'Número')} />
            <ToolboxItem type="email" icon="mail" label="Email" onClick={() => onAddField('email', 'Correo Electrónico')} />
          </div>
        </div>

        {/* Category: Selection */}
        <div>
          <h4 className="text-text-primary font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-text-secondary text-base">list_alt</span>
            Selección
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <ToolboxItem type="checkbox" icon="check_box" label="Casilla" onClick={() => onAddField('checkbox', 'Casilla de Verificación')} />
            <ToolboxItem type="radio" icon="radio_button_checked" label="Radio" onClick={() => onAddField('radio', 'Opción Única')} />
            <ToolboxItem type="select" icon="arrow_drop_down_circle" label="Desplegable" onClick={() => onAddField('select', 'Lista Desplegable')} />
          </div>
        </div>

        {/* Category: Advanced */}
        <div>
          <h4 className="text-text-primary font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-text-secondary text-base">star</span>
            Avanzado
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <ToolboxItem type="date" icon="calendar_month" label="Fecha y Hora" onClick={() => onAddField('date', 'Fecha')} />
            <ToolboxItem type="file" icon="cloud_upload" label="Subir Archivo" onClick={() => onAddField('file', 'Archivo Adjunto')} />
            <ToolboxItem type="grid" icon="table_chart" label="Grilla de Datos" onClick={() => onAddField('grid', 'Tabla Detallada')} />
          </div>
        </div>

        {/* Category: Layout */}
        <div>
          <h4 className="text-text-primary font-bold text-sm mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-text-secondary text-base">dashboard</span>
            Diseño
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <ToolboxItem type="section" icon="ad_group" label="Sección / Grupo" onClick={() => onAddField('section', 'Nueva Sección')} />
            <ToolboxItem type="spacer" icon="space_bar" label="Espaciador" onClick={() => onAddField('spacer', 'Espaciador')} />
            <ToolboxItem type="divider" icon="horizontal_rule" label="Separador" onClick={() => onAddField('divider', 'Separador')} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Toolbox;
