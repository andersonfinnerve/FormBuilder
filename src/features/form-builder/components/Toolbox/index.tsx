import React, { useState } from 'react';
import { FieldType, SharedFieldDefinition } from '../../../../types';
import { Input } from '../../../../shared/components/ui/Input';
import ToolboxItem from './ToolboxItem';
import ToolboxCategory from './ToolboxCategory';
import SubTitle from '../../../../shared/components/ui/SubTitle';
import MasterDataItem from './MasterDataItem';
import { MASTER_DATA } from '../../../../core/services/mockMasterData';
import { MasterData } from '../../../../types';

interface ToolboxProps {
  onAddField: (type: FieldType, label: string) => void;
  sharedLibrary: SharedFieldDefinition[];
  onAddSharedField: (field: SharedFieldDefinition) => void;
  onAddMasterData?: (data: MasterData) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onAddField, sharedLibrary, onAddSharedField, onAddMasterData }) => {
  // const hasSharedFields = sharedLibrary && sharedLibrary.length > 0;
  const hasSharedFields = false;
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar datos maestros según búsqueda
  const filteredMasterData = MASTER_DATA.filter(data =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMasterData = (data: MasterData) => {
    if (onAddMasterData) {
      onAddMasterData(data);
    } else {
      // Fallback: convertir a campo normal
      const fieldType = data.type === 'registry' ? 'select' : 'text';
      onAddField(fieldType, data.name);
    }
  };

  return (
    <aside className="w-72 bg-surface-dark border-r border-border-dark flex flex-col z-10 shrink-0 hidden lg:flex">
      <div className="p-4 border-b border-border-dark">
        <SubTitle title="Caja de Herramientas" />
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-text-secondary text-lg z-10">
            search
          </span>
          <Input
            className="bg-background-dark border-border-dark pl-9 placeholder-text-secondary"
            placeholder="Buscar en Datos Maestros..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Datos Maestros */}
        <div className="bg-gradient-to-b from-purple-500/5 to-transparent rounded-xl border border-purple-500/20 p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-purple-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">database</span>
              Datos Maestros
            </h4>
            <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-bold">
              {filteredMasterData.length}
            </span>
          </div>

          {filteredMasterData.length > 0 ? (
            <>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
                {filteredMasterData.map((data) => (
                  <MasterDataItem
                    key={data.FormDataId}
                    data={data}
                    onClick={() => handleAddMasterData(data)}
                  />
                ))}
              </div>
              <div className="mt-2 text-[10px] text-purple-400/60 text-center font-medium">
                {searchTerm ? `${filteredMasterData.length} resultado${filteredMasterData.length !== 1 ? 's' : ''}` : 'Deslice para ver más'}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-text-secondary text-xs">
              <span className="material-symbols-outlined text-2xl mb-1 block">search_off</span>
              No se encontraron datos
            </div>
          )}
        </div>

        {hasSharedFields && (
          <>
            <div className="h-px bg-border-dark w-full"></div>
            <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-primary/20 p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">cloud_circle</span>
                  Librería Central
                </h4>
                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                  {sharedLibrary.length}
                </span>
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
          </>
        )}

        <div className="h-px bg-border-dark w-full"></div>

        <ToolboxCategory title="Básicos" icon="check_box_outline_blank">
          <ToolboxItem type="text" icon="short_text" label="Texto Corto" onClick={() => onAddField('text', 'Texto Corto')} />
          <ToolboxItem type="textarea" icon="notes" label="Párrafo Largo" onClick={() => onAddField('textarea', 'Párrafo')} />
          <ToolboxItem type="number" icon="123" label="Número" onClick={() => onAddField('number', 'Número')} />
          <ToolboxItem type="email" icon="mail" label="Email" onClick={() => onAddField('email', 'Correo Electrónico')} />
        </ToolboxCategory>

        <ToolboxCategory title="Selección" icon="list_alt">
          <ToolboxItem type="checkbox" icon="check_box" label="Casilla" onClick={() => onAddField('checkbox', 'Casilla de Verificación')} />
          <ToolboxItem type="radio" icon="radio_button_checked" label="Radio" onClick={() => onAddField('radio', 'Opción Única')} />
          <ToolboxItem type="select" icon="arrow_drop_down_circle" label="Desplegable" onClick={() => onAddField('select', 'Lista Desplegable')} />
        </ToolboxCategory>

        <ToolboxCategory title="Avanzado" icon="star">
          <ToolboxItem type="date" icon="calendar_month" label="Fecha y Hora" onClick={() => onAddField('date', 'Fecha')} />
          <ToolboxItem type="file" icon="cloud_upload" label="Subir Archivo" onClick={() => onAddField('file', 'Archivo Adjunto')} />
          <ToolboxItem type="grid" icon="table_chart" label="Grilla de Datos" onClick={() => onAddField('grid', 'Tabla Detallada')} />
        </ToolboxCategory>

        <ToolboxCategory title="Diseño" icon="dashboard">
          <ToolboxItem type="section" icon="ad_group" label="Sección / Grupo" onClick={() => onAddField('section', 'Nueva Sección')} />
          <ToolboxItem type="spacer" icon="space_bar" label="Espaciador" onClick={() => onAddField('spacer', 'Espaciador')} />
          <ToolboxItem type="divider" icon="horizontal_rule" label="Separador" onClick={() => onAddField('divider', 'Separador')} />
        </ToolboxCategory>
      </div>
    </aside>
  );
};

export default Toolbox;
