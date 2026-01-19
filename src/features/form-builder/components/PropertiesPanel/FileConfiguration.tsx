import React from 'react';
import { FormField } from '@/types';
import { Input } from '../../../../shared/components/ui/Input';

interface FileConfigurationProps {
  field: FormField;
  onChange: (key: keyof FormField, value: any) => void;
}

const FileConfiguration: React.FC<FileConfigurationProps> = ({ field, onChange }) => {
  const fieldSettings: FormField = field;

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configuración de Carga</h4>

        <div className="space-y-2">
          <label className="text-sm text-text-primary font-medium block">Estilo Visual</label>
          <div className="grid grid-cols-2 gap-2 bg-background-dark p-1 rounded-lg border border-border-dark">
            <button
              onClick={() => onChange('FileStyle', 'dropzone')}
              className={`text-xs py-2 rounded transition-all ${(!fieldSettings.FileStyle || fieldSettings.FileStyle === 'dropzone') ? 'bg-surface-dark text-text-primary shadow' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Zona de Arrastre
            </button>
            <button
              onClick={() => onChange('FileStyle', 'button')}
              className={`text-xs py-2 rounded transition-all ${fieldSettings.FileStyle === 'button' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Botón de Acción
            </button>
          </div>
        </div>

        {fieldSettings.FileStyle === 'button' && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs text-primary font-bold block">Enlace de Referencia (Ej. PDF Guía)</label>
              <Input
                type="text"
                placeholder="https://..."
                value={fieldSettings.DownloadUrl || ''}
                onChange={(e) => onChange('DownloadUrl', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-primary font-bold block">Texto del Enlace</label>
              <Input
                type="text"
                placeholder="Ej. Descargar Documento W-9"
                value={fieldSettings.DownloadText || ''}
                onChange={(e) => onChange('DownloadText', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileConfiguration;
