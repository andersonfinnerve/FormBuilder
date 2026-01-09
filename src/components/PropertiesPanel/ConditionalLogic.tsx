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
  const fieldSettings: FormField = field;
  const handleLogicUpdate = (key: keyof LogicRule, value: any) => {
    const currentLogic = fieldSettings.Logic || { TriggerId: '', TriggerFormDataId: null, Value: '', Enabled: false };
    if (key === 'TriggerId' && value !== currentLogic.TriggerId) {
      // Cuando cambia el trigger, buscar su formDataId
      const triggerField = availableTriggers.find(f => f.ComponentId === value);
      const triggerFormDataId = triggerField?.FormDataId ?? null;
      onChange('Logic', { ...currentLogic, TriggerId: value, TriggerFormDataId: triggerFormDataId, Value: '' });
    } else {
      onChange('Logic', { ...currentLogic, [key]: value });
    }
  };

  const toggleLogic = (enabled: boolean) => {
    const currentLogic = fieldSettings.Logic || { TriggerId: '', TriggerFormDataId: null, Value: '', Enabled: false };
    onChange('Logic', { ...currentLogic, Enabled: enabled });
  };

  const selectedTriggerField = availableTriggers.find(f => f.ComponentId === fieldSettings.Logic?.TriggerId);

  return (
    <>
      <div className="h-px bg-border-dark w-full"></div>
      <div className="space-y-4">
        {/* <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">Lógica Condicional</h4> */}
        <SubTitle title="Lógica Condicional" />
        
        <ToggleSwitch 
          label="Visibilidad"
          description="Mostrar/ocultar dinámicamente"
          checked={!!fieldSettings.Logic?.Enabled}
          onChange={toggleLogic}
        />

        {fieldSettings.Logic?.Enabled && (
          <div className="bg-background-dark/50 border border-border-dark rounded-lg p-3 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs text-text-primary font-medium">Mostrar este campo cuando:</label>
              <Select 
                className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
                value={fieldSettings.Logic.TriggerId || ''}
                onChange={(e) => handleLogicUpdate('TriggerId', e.target.value)}
              >
                <option value="">-- Seleccionar Campo --</option>
                {availableTriggers.map(f => (
                  <option key={f.ComponentId} value={f.ComponentId}>{f.Label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-primary font-medium">Es igual a:</label>
              {selectedTriggerField && (selectedTriggerField.Type === 'select' || selectedTriggerField.Type === 'radio') && selectedTriggerField.Options ? (
                <Select 
                  className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
                  value={fieldSettings.Logic.Value || ''}
                  onChange={(e) => handleLogicUpdate('Value', e.target.value)}
                >
                  <option value="">-- Seleccionar Valor --</option>
                  {selectedTriggerField.Options.map((opt, idx) => (
                    <option key={idx} value={opt.TextValue}>{opt.TextValue}</option>
                  ))}
                </Select>
              ) : (
                <Input 
                  type="text"
                  className="bg-surface-dark border-border-dark px-2 py-1.5 text-xs"
                  placeholder="Valor esperado"
                  value={fieldSettings.Logic.Value || ''}
                  onChange={(e) => handleLogicUpdate('Value', e.target.value)}
                />
              )}
            </div>
            
            {(!fieldSettings.Logic.TriggerId) && (
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
