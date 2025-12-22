import React from 'react';
import { FormField } from '../../types';

interface GeneralSettingsProps {
  field: FormField;
  isShared: boolean;
  onChange: (key: keyof FormField, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ field, isShared, onChange }) => {
  return (
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
          value={field.label}
          onChange={(e) => onChange('label', e.target.value)}
        />
        {isShared && <p className="text-[10px] text-text-secondary">Puede renombrar la etiqueta localmente sin afectar la fuente.</p>}
      </div>
      
      {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'textarea') && (
        <div className="space-y-1.5">
          <label className="text-sm text-white font-medium block">Placeholder</label>
          <input 
            className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
            type="text" 
            value={field.placeholder || ''}
            onChange={(e) => onChange('placeholder', e.target.value)}
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
          value={field.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Ej. Ingrese aquí su **información** detallada."
        ></textarea>
      </div>
    </div>
  );
};

export default GeneralSettings;
