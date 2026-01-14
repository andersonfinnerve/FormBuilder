import React from 'react';
import { FormField } from '../../../../types';
import { Input, TextArea } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { CONTACT_PHYSICAL_COLUMNS } from '../../../../data/mock/physicalColumns';

interface GeneralSettingsProps {
  field: FormField;
  isShared: boolean;
  onChange: (key: keyof FormField, value: any) => void;
  mappedColumns?: string[]; // Columnas ya mapeadas en otros campos
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ field, isShared, onChange, mappedColumns = [] }) => {
  // Filtrar columnas ya mapeadas (excepto la actual del campo)
  const availableColumns = CONTACT_PHYSICAL_COLUMNS.filter(col =>
    !mappedColumns.includes(col.id) || col.id === fieldSettings.PhysicalColumn
  );

  const fieldSettings: FormField = field;

  const isMasterData = fieldSettings.FormDataId != null;
  console.log('Mapped Columns:', fieldSettings, isMasterData);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configuración General</h4>
        <div className="flex gap-1">
          {isShared && (
            <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20" title="Este campo está vinculado a una fuente de datos centralizada">
              <span className="material-symbols-outlined text-xs">link</span>
              <span className="text-[10px] font-bold uppercase">Vinculado</span>
            </div>
          )}
          {isMasterData && (
            <div className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20" title={`Proviene del Dato Maestro: ${fieldSettings.FormDataId || fieldSettings.FormDataGridId}`}>
              <span className="material-symbols-outlined text-xs">database</span>
              <span className="text-[10px] font-bold uppercase">Maestro</span>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Etiqueta del Campo"
        type="text"
        value={fieldSettings.Label}
        onChange={(e) => onChange('Label', e.target.value)}
        disabled={isMasterData}
        description={isMasterData ? "El dato maestro no se verá afectado." : isShared ? "Puede renombrar la etiqueta localmente sin afectar la fuente." : undefined}
      />

      {(fieldSettings.Type === 'text' || fieldSettings.Type === 'email' || fieldSettings.Type === 'number' || fieldSettings.Type === 'textarea') && (
        <Input
          label="Placeholder"
          type="text"
          value={fieldSettings.Placeholder || ''}
          onChange={(e) => onChange('Placeholder', e.target.value)}
        />
      )}

      <TextArea
        label="Descripción / Ayuda"
        helperText={<span className="text-[10px] text-primary cursor-help" title="Use **negrita** para resaltar y [texto](url) para enlaces.">Soporta Markdown</span>}
        rows={4}
        value={fieldSettings.Description || ''}
        onChange={(e) => onChange('Description', e.target.value)}
        placeholder="Ej. Ingrese aquí su **información** detallada."
      />

      {/* Mapeo a Columna Física */}
      <div className="space-y-2">
        <Select
          label="Mapear a Campo Físico (Opcional)"
          value={fieldSettings.PhysicalColumn || ''}
          onChange={(e) => onChange('physicalColumn', e.target.value || undefined)}
        >
          <option value="">-- Sin mapear --</option>
          {availableColumns.map(col => (
            <option key={col.id} value={col.id}>
              {col.label} ({col.id})
            </option>
          ))}
        </Select>
        {fieldSettings.PhysicalColumn && (
          <div className="text-xs text-text-secondary bg-background-dark p-2 rounded border border-border-dark">
            <span className="material-symbols-outlined text-sm text-primary align-middle mr-1">info</span>
            Este campo guardará datos en: <strong className="text-primary">{fieldSettings.PhysicalColumn}</strong>
          </div>
        )}
        {mappedColumns.length > 0 && (
          <p className="text-[10px] text-text-secondary">
            {mappedColumns.length} columna{mappedColumns.length > 1 ? 's' : ''} ya mapeada{mappedColumns.length > 1 ? 's' : ''} en otros campos
          </p>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;
