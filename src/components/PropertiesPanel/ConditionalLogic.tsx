import React from 'react';
import { FormField, LogicRule } from '../../types';

interface ConditionalLogicProps {
  field: FormField;
  availableTriggers: FormField[];
  onChange: (key: keyof FormField, value: any) => void;
}

const ConditionalLogic: React.FC<ConditionalLogicProps> = ({ field, availableTriggers, onChange }) => {
  const handleLogicUpdate = (key: keyof LogicRule, value: any) => {
    const currentLogic = field.logic || { triggerId: '', value: '', enabled: false };
    if (key === 'triggerId' && value !== currentLogic.triggerId) {
      onChange('logic', { ...currentLogic, triggerId: value, value: '' });
    } else {
      onChange('logic', { ...currentLogic, [key]: value });
    }
  };

  const toggleLogic = (enabled: boolean) => {
    const currentLogic = field.logic || { triggerId: '', value: '', enabled: false };
    onChange('logic', { ...currentLogic, enabled });
  };

  const selectedTriggerField = availableTriggers.find(f => f.id === field.logic?.triggerId);

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        <div className="flex items-center justify-between group">
          <div className="flex flex-col">
            <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Lógica Condicional</h4>
            <span className="text-xs text-text-secondary">Mostrar/ocultar dinámicamente</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={!!field.logic?.enabled}
              onChange={(e) => toggleLogic(e.target.checked)}
            />
            <div className="w-9 h-5 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {field.logic?.enabled && (
          <div className="bg-background-dark/50 border border-border-dark rounded-lg p-3 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs text-white font-medium">Mostrar este campo cuando:</label>
              <select 
                className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                value={field.logic.triggerId || ''}
                onChange={(e) => handleLogicUpdate('triggerId', e.target.value)}
              >
                <option value="">-- Seleccionar Campo --</option>
                {availableTriggers.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white font-medium">Es igual a:</label>
              {selectedTriggerField && (selectedTriggerField.type === 'select' || selectedTriggerField.type === 'radio') && selectedTriggerField.options ? (
                <select 
                  className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                  value={field.logic.value || ''}
                  onChange={(e) => handleLogicUpdate('value', e.target.value)}
                >
                  <option value="">-- Seleccionar Valor --</option>
                  {selectedTriggerField.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="text"
                  className="w-full bg-surface-dark border border-border-dark rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
                  placeholder="Valor esperado"
                  value={field.logic.value || ''}
                  onChange={(e) => handleLogicUpdate('value', e.target.value)}
                />
              )}
            </div>
            
            {(!field.logic.triggerId) && (
              <p className="text-[10px] text-yellow-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span>
                Seleccione un campo disparador.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConditionalLogic;
