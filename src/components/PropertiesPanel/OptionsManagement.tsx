import React from 'react';
import { FormField } from '../../types';

interface OptionsManagementProps {
  field: FormField;
  isShared: boolean;
  onChange: (key: keyof FormField, value: any) => void;
}

const OptionsManagement: React.FC<OptionsManagementProps> = ({ field, isShared, onChange }) => {
  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      
      {isShared ? (
        <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex gap-3">
          <span className="material-symbols-outlined text-primary">cloud_done</span>
          <div>
            <h4 className="text-white text-xs font-bold mb-1">Opciones Centralizadas</h4>
            <p className="text-[10px] text-text-secondary leading-tight">
              Las opciones de este campo provienen de una biblioteca compartida. No se pueden editar aquí para mantener la consistencia entre formularios.
            </p>
            <div className="mt-2 text-xs text-white opacity-60">
              {field.options?.length} opciones cargadas.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Opciones</h4>
            <button 
              onClick={() => onChange('options', [...(field.options || []), 'Nueva Opción'])}
              className="text-primary text-xs font-bold hover:underline"
            >
              + Agregar
            </button>
          </div>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-1.5 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[index] = e.target.value;
                    onChange('options', newOptions);
                  }}
                />
                <button 
                  onClick={() => {
                    const newOptions = (field.options || []).filter((_, i) => i !== index);
                    onChange('options', newOptions);
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
