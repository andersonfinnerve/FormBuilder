import React from 'react';
import { FormField } from '../../types';

interface AppearanceSettingsProps {
  field: FormField;
  onChange: (key: keyof FormField, value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ field, onChange }) => {
  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Apariencia y Diseño</h4>
        <div className="space-y-2">
          <label className="text-sm text-text-primary font-medium block">Ancho del Campo</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onChange('width', 'full')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${field.width === 'full' ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark bg-background-dark text-text-secondary hover:text-text-primary'}`}
            >
              <div className="w-full h-2 bg-current rounded mb-2 opacity-50"></div>
              <span className="text-xs font-medium">100% (Ancho)</span>
            </button>
            <button 
              onClick={() => onChange('width', 'half')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${field.width === 'half' ? 'border-primary bg-primary/10 text-primary' : 'border-border-dark bg-background-dark text-text-secondary hover:text-text-primary'}`}
            >
              <div className="flex gap-1 w-full mb-2">
                <div className="w-1/2 h-2 bg-current rounded opacity-50"></div>
                <div className="w-1/2 h-2 bg-border-dark rounded opacity-20"></div>
              </div>
              <span className="text-xs font-medium">50% (Columna)</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppearanceSettings;
