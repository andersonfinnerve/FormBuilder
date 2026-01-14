import React from 'react';
import { OnboardingStep, OnboardingStepType } from '../../types/onboarding';
import { Input } from '../../shared/components/ui/Input';
import { Select } from '../../shared/components/ui/Select';
import { mockForms, mockQuestionnaires } from '../../data/mockOnboardingData';

interface StepCardProps {
  step: OnboardingStep;
  index: number;
  totalSteps: number;
  onUpdate: (id: string, updates: Partial<OnboardingStep>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, totalSteps, onUpdate, onDelete, onMove }) => {
  const availableResources = step.type === 'form' ? mockForms : mockQuestionnaires;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-sm relative group transition-all hover:border-primary/50">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-border group-hover:bg-primary transition-colors rounded-l-lg"></div>
      
      <div className="flex gap-4 items-start pl-2">
        {/* Step Number Indicator */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <div className="w-6 h-6 rounded-full bg-background-secondary border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
            {index + 1}
          </div>
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onMove(step.id, 'up')}
              disabled={index === 0}
              className="p-0.5 hover:bg-background-secondary rounded text-text-secondary disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-lg">keyboard_arrow_up</span>
            </button>
            <button 
              onClick={() => onMove(step.id, 'down')}
              disabled={index === totalSteps - 1}
              className="p-0.5 hover:bg-background-secondary rounded text-text-secondary disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Input
              label="Nombre del Paso"
              value={step.name}
              onChange={(e) => onUpdate(step.id, { name: e.target.value })}
              placeholder="Ej. Datos Personales"
            />
          </div>
          
          <div className="md:col-span-3">
            <Select
              label="Tipo de Contenido"
              value={step.type}
              onChange={(e) => onUpdate(step.id, { 
                type: e.target.value as OnboardingStepType,
                resourceId: '' // Reset resource when type changes
              })}
            >
              <option value="form">Formulario</option>
              <option value="questionnaire">Cuestionario</option>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Select
              label={step.type === 'form' ? 'Seleccionar Formulario' : 'Seleccionar Cuestionario'}
              value={step.resourceId}
              onChange={(e) => onUpdate(step.id, { resourceId: e.target.value })}
              className={!step.resourceId ? 'text-text-secondary' : ''}
            >
              <option value="">Seleccione un registro...</option>
              {availableResources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="md:col-span-1 flex items-end justify-end pb-2">
            <button
              onClick={() => onDelete(step.id)}
              className="text-text-secondary hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Eliminar paso"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
