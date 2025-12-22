import React from 'react';
import { FormField } from '../../types';

interface FileConfigurationProps {
  field: FormField;
  onChange: (key: keyof FormField, value: any) => void;
}

const FileConfiguration: React.FC<FileConfigurationProps> = ({ field, onChange }) => {
  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Configuración de Carga</h4>
        
        <div className="space-y-2">
          <label className="text-sm text-white font-medium block">Estilo Visual</label>
          <div className="grid grid-cols-2 gap-2 bg-background-dark p-1 rounded-lg border border-border-dark">
            <button 
              onClick={() => onChange('fileStyle', 'dropzone')}
              className={`text-xs py-2 rounded transition-all ${(!field.fileStyle || field.fileStyle === 'dropzone') ? 'bg-surface-dark text-white shadow' : 'text-text-secondary hover:text-white'}`}
            >
              Zona de Arrastre
            </button>
            <button 
              onClick={() => onChange('fileStyle', 'button')}
              className={`text-xs py-2 rounded transition-all ${field.fileStyle === 'button' ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-white'}`}
            >
              Botón de Acción
            </button>
          </div>
        </div>

        {field.fileStyle === 'button' && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs text-primary font-bold block">Enlace de Referencia (Ej. PDF Guía)</label>
              <input 
                className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                type="text"
                placeholder="https://..."
                value={field.downloadUrl || ''}
                onChange={(e) => onChange('downloadUrl', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-primary font-bold block">Texto del Enlace</label>
              <input 
                className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                type="text"
                placeholder="Ej. Descargar Documento W-9"
                value={field.downloadText || ''}
                onChange={(e) => onChange('downloadText', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileConfiguration;
