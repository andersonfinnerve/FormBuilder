import React from 'react';
import { FormField, LogicRule } from '../../types';
import ToggleSwitch from '../common/ToggleSwitch';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import SubTitle from '../Toolbox/SubTitle';

interface ConditionalLogicProps {
  field: FormField;
  availableTriggers: FormField[];
  onChange: (key: keyof FormField, value: any) => void;
}

const ConditionalLogic: React.FC<ConditionalLogicProps> = ({ field, availableTriggers, onChange }) => {
  const handleLogicUpdate = (key: keyof LogicRule, value: any) => {
    const currentLogic = field.logic || { triggerId: '', triggerFormDataId: null, value: '', enabled: false };
    if (key === 'triggerId' && value !== currentLogic.triggerId) {
      // Cuando cambia el trigger, buscar su formDataId
      const triggerField = availableTriggers.find(f => f.componentId === value);
      const triggerFormDataId = triggerField?.formDataId ?? null;
      onChange('logic', { ...currentLogic, triggerId: value, triggerFormDataId, value: '' });
    } else {
      onChange('logic', { ...currentLogic, [key]: value });
    }
  };

  const toggleLogic = (enabled: boolean) => {
    const currentLogic = field.logic || { triggerId: '', triggerFormDataId: null, value: '', enabled: false };
    onChange('logic', { ...currentLogic, enabled });
  };

  const selectedTriggerField = availableTriggers.find(f => f.componentId === field.logic?.triggerId);

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        {/* <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Lógica Condicional</h4> */}
        <SubTitle title="Lógica Condicional" />
        
        <ToggleSwitch 
          label="Visibilidad"
          description="Mostrar/ocultar dinámicamente"
          checked={!!field.logic?.enabled}
          onChange={toggleLogic}
        />

        {field.logic?.enabled && (
          <div className="bg-background-dark/50 border border-border-dark rounded-lg p-3 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs text-text-primary font-medium">Mostrar este campo cuando:</label>
              <Select 
                className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
                value={field.logic.triggerId || ''}
                onChange={(e) => handleLogicUpdate('triggerId', e.target.value)}
              >
                <option value="">-- Seleccionar Campo --</option>
                {availableTriggers.map(f => (
                  <option key={f.componentId} value={f.componentId}>{f.label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-primary font-medium">Es igual a:</label>
              {selectedTriggerField && (selectedTriggerField.type === 'select' || selectedTriggerField.type === 'radio') && selectedTriggerField.options ? (
                <Select 
                  className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
                  value={field.logic.value || ''}
                  onChange={(e) => handleLogicUpdate('value', e.target.value)}
                >
                  <option value="">-- Seleccionar Valor --</option>
                  {selectedTriggerField.options.map((opt, idx) => (
                    <option key={idx} value={opt.TextValue}>{opt.TextValue}</option>
                  ))}
                </Select>
              ) : (
                <Input 
                  type="text"
                  className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
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
