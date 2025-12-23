import React from 'react';
import { FormField } from '../../types';
import ToggleSwitch from '../common/ToggleSwitch';

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
        
        <ToggleSwitch 
          label="Campo Obligatorio"
          description="Requerido para enviar"
          checked={field.required}
          onChange={(checked) => onChange('required', checked)}
        />
      </div>
    </>
  );
};

export default ValidationRules;
