import React from 'react';
import { FormField } from '../../types';

interface ValidationRulesProps {
  field: FormField;
  onChange: (key: keyof FormField, value: any) => void;
}

const ValidationRules: React.FC<ValidationRulesProps> = ({ field, onChange }) => {
  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Reglas</h4>
        
        <div className="flex items-center justify-between group">
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">Campo Obligatorio</span>
            <span className="text-xs text-text-secondary">Requerido para enviar</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={field.required}
              onChange={(e) => onChange('required', e.target.checked)}
            />
            <div className="w-11 h-6 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </>
  );
};

export default ValidationRules;
