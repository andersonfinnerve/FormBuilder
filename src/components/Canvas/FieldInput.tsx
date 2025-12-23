import React from 'react';
import { FormField } from '../../types';
import { parseRichText } from '../../utils/richText';

interface FieldInputProps {
  field: FormField;
}

const FieldInput: React.FC<FieldInputProps> = ({ field }) => {
  const commonClasses = "w-full bg-background-dark border-border-dark rounded-lg px-4 py-2.5 text-white placeholder-gray-600 border focus:border-primary focus:ring-0 pointer-events-none";
  const isButtonStyleFile = field.type === 'file' && field.fileStyle === 'button';
  const isTableStyleFile = field.type === 'file' && field.fileStyle === 'table';

  switch (field.type) {
    case 'textarea':
      return <textarea className={commonClasses} placeholder={field.placeholder} rows={3} readOnly={field.readOnly} />;
    
    case 'select':
      return (
        <div className="relative">
          <select className={`${commonClasses} appearance-none`} disabled>
            <option>Seleccionar opción...</option>
          </select>
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

    default: 
      return <input className={commonClasses} placeholder={field.placeholder} type={field.type} readOnly={field.readOnly} />;
  }
};

export default FieldInput;
