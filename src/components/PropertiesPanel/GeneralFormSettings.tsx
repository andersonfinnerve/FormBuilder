import React from 'react';
import { FormConfig } from '../../types';
import { Input } from '../common/Input';
import SubTitle from '../Toolbox/SubTitle';

interface GeneralFormSettingsProps {
  formConfig: FormConfig;
  onUpdateFormConfig: <K extends keyof FormConfig>(key: K, value: FormConfig[K]) => void;
}

const GeneralFormSettings: React.FC<GeneralFormSettingsProps> = ({ formConfig, onUpdateFormConfig }) => {
  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Configuración del Formulario</h3>
        <span className="material-symbols-outlined text-primary">settings</span>
      </div>

      <div className="h-px bg-border-dark w-full"></div>

      <div className="space-y-4">
        <SubTitle title="Información General" />
        
        <div className="space-y-2">
          <label className="text-sm text-text-primary font-medium block">
            Título del Formulario
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formConfig.Title}
            onChange={(e) => onUpdateFormConfig('Title', e.target.value)}
            className="w-full px-3 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            placeholder="Ej. Formulario de Registro de Cliente"
          />
          <p className="text-xs text-text-secondary mt-1">
            Este título aparecerá en la parte superior del formulario
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-primary font-medium block">
            Descripción
          </label>
          <textarea
            value={formConfig.Description || ''}
            onChange={(e) => onUpdateFormConfig('Description', e.target.value)}
            className="w-full px-3 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm resize-none"
            placeholder="Ej. Por favor complete todos los campos requeridos..."
            rows={3}
          />
          <p className="text-xs text-text-secondary mt-1">
            Instrucciones o descripción breve del formulario
          </p>
        </div>
      </div>

      <div className="h-px bg-border-dark w-full"></div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-400 text-xl">info</span>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-300 mb-1">Configuración Global</h4>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              El título y la descripción se aplican a todo el formulario. Para editar las propiedades de un campo específico, selecciónelo en el canvas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralFormSettings;
