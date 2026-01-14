import React from 'react';
import { FormField } from '../../../../types';
import { parseRichText } from '../../../../shared/utils/richText';
import { Select } from '../../../../shared/components/ui/Select';

interface FieldInputProps {
  field: FormField;
}

const FieldInput: React.FC<FieldInputProps> = ({ field }) => {
  const commonClasses = "w-full bg-background-dark border-border-dark rounded-lg px-4 py-2.5 text-text-primary placeholder-text-secondary border focus:border-primary focus:ring-0 pointer-events-none";
  const fieldSettings: FormField = field;
  const isButtonStyleFile = fieldSettings.Type === 'file' && fieldSettings.FileStyle === 'button';

  switch (field.Type) {
    case 'textarea':
      return <textarea className={commonClasses} placeholder={field.Placeholder} rows={3} readOnly={field.ReadOnly} />;

    case 'select':
      return (
        <Select className="bg-background-dark border-border-dark pointer-events-none" disabled>
          <option>Seleccionar opción...</option>
        </Select>
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-3 p-2 border border-border-dark rounded-lg bg-background-dark">
          <input type="checkbox" className="w-5 h-5 rounded border-border-dark text-primary" disabled />
          <span className="text-text-primary text-sm">{field.Placeholder || 'Opción'}</span>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {field.Options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="radio" className="w-4 h-4 border-border-dark text-primary" disabled />
              <span className="text-text-primary text-sm">{opt.TextValue}</span>
            </div>
          ))}
        </div>
      );

    case 'file':
      if (isButtonStyleFile) {
        return (
          <div className="space-y-4 pt-1">
            {(field.Description || field.DownloadUrl) && (
              <div className="text-sm text-text-secondary leading-relaxed">
                {field.Description && <div dangerouslySetInnerHTML={parseRichText(field.Description)} />}
                {field.DownloadUrl && (
                  <div className="mt-2 text-primary font-bold inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">description</span>
                    {field.DownloadText || "Descargar documento adjunto"}
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

    case 'spacer':
      return (
        <div className="w-full h-12 border border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/20">
          <span className="text-xs text-text-secondary font-mono">Espacio Vacío ({field.Width === 'full' ? '100%' : '50%'})</span>
        </div>
      );

    case 'divider':
      return <div className="py-2"><hr className="border-border-dark" /></div>;

    case 'grid':
      return (
        <div className="w-full overflow-hidden border border-border-dark rounded-lg">
          <div className="bg-surface-dark border-b border-border-dark px-4 py-2 text-xs text-text-secondary uppercase">Vista Previa Tabla</div>
          <div className="p-4 text-center text-xs text-text-secondary italic">Tabla configurada con {field.Columns?.length || 0} columnas</div>
        </div>
      );

    default:
      return <input className={commonClasses} placeholder={field.Placeholder} type={field.Type} readOnly={field.ReadOnly} />;
  }
};

export default FieldInput;
