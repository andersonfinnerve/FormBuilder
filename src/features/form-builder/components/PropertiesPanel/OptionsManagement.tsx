import React from 'react';
import { FormField } from '../../../../types';
import { Input } from '../../../../shared/components/ui/Input';

interface OptionsManagementProps {
  field: FormField;
  isShared: boolean;
  onChange: (key: keyof FormField, value: any) => void;
}

const OptionsManagement: React.FC<OptionsManagementProps> = ({ field, isShared, onChange }) => {
    const fieldSettings: FormField = field;

  const isMasterData = (typeof fieldSettings.FormDataId === 'string') || (typeof fieldSettings.FormDataGridId === 'string');

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>

      {isShared ? (
        <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex gap-3">
          <span className="material-symbols-outlined text-primary">cloud_done</span>
          <div>
            <h4 className="text-text-primary text-xs font-bold mb-1">Opciones Centralizadas</h4>
            <p className="text-[10px] text-text-secondary leading-tight">
              Las opciones de este campo provienen de una biblioteca compartida. No se pueden editar aquí para mantener la consistencia entre formularios.
            </p>
            <div className="mt-2 text-xs text-text-primary opacity-60">
              {fieldSettings.Options?.length} opciones cargadas.
            </div>
          </div>
        </div>
      ) : isMasterData ? (
        <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex gap-3">
          <span className="material-symbols-outlined text-purple-400">database</span>
          <div>
            <h4 className="text-text-primary text-xs font-bold mb-1">Opciones del Dato Maestro</h4>
            <p className="text-[10px] text-text-secondary leading-tight">
              Las opciones de este campo provienen del dato maestro del BackOffice. No se pueden editar aquí para mantener la integridad de los datos.
            </p>
            <div className="mt-2 text-xs text-text-primary opacity-60">
              {fieldSettings.Options?.length} opciones cargadas desde el maestro.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Opciones</h4>
            <button
              onClick={() => onChange('Options', [...(fieldSettings.Options || []), { DataOptionId: undefined, TextValue: 'Nueva Opción' }])}
              className="text-primary text-xs font-bold hover:underline"
            >
              + Agregar
            </button>
          </div>
          <div className="space-y-2">
            {fieldSettings.Options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option.TextValue}
                  onChange={(e) => {
                    const newOptions = [...(fieldSettings.Options || [])];
                    newOptions[index] = { ...newOptions[index], TextValue: e.target.value };
                    onChange('Options', newOptions);
                  }}
                />
                <button
                  onClick={() => {
                    const newOptions = (fieldSettings.Options || []).filter((_, i) => i !== index);
                    onChange('Options', newOptions);
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
  );
};

export default OptionsManagement;
