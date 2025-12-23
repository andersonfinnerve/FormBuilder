import React, { useState, useEffect } from 'react';
import { OnboardingFlow, OnboardingStep, PersonType } from '../../types/onboarding';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import StepCard from './StepCard';

interface OnboardingConfigProps {
  initialFlow?: OnboardingFlow | null;
  onSave: (flow: OnboardingFlow) => void;
  onCancel: () => void;
}

const OnboardingConfig: React.FC<OnboardingConfigProps> = ({ initialFlow, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [personType, setPersonType] = useState<PersonType>('natural');
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    if (initialFlow) {
      setName(initialFlow.name);
      setPersonType(initialFlow.personType);
      setSteps(initialFlow.steps.sort((a, b) => a.order - b.order));
    } else {
      // Default state for new flow
      setName('Nuevo Flujo de Onboarding');
      setPersonType('natural');
      setSteps([]);
    }
  }, [initialFlow]);

  const handleAddStep = () => {
    const newStep: OnboardingStep = {
      id: `step_${Date.now()}`,
      order: steps.length + 1,
      name: `Paso ${steps.length + 1}`,
      type: 'form',
      resourceId: ''
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (id: string, updates: Partial<OnboardingStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const handleDeleteStep = (id: string) => {
    const filtered = steps.filter(step => step.id !== id);
    // Reorder remaining steps
    const reordered = filtered.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    setSteps(reordered);
  };

  const handleMoveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newSteps = [...steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    
    // Update order property
    const reordered = newSteps.map((step, idx) => ({
      ...step,
      order: idx + 1
    }));
    
    setSteps(reordered);
  };

  const handleSave = () => {
    const flow: OnboardingFlow = {
      id: initialFlow?.id || `flow_${Date.now()}`,
      name,
      personType,
      steps,
      createdAt: initialFlow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(flow);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-background-secondary rounded-full text-text-secondary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Configuración de Flujo</h1>
            <p className="text-text-secondary text-sm">Define la secuencia de pasos para el onboarding</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Main Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Settings & Stepper Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Configuración General</h3>
            <div className="space-y-4">
              <Input
                label="Nombre del Flujo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Onboarding Inversionista"
              />
              <Select
                label="Tipo de Persona"
                value={personType}
                onChange={(e) => setPersonType(e.target.value as PersonType)}
              >
                <option value="natural">Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
              </Select>
            </div>
          </div>

          {/* Stepper Preview */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Vista Previa del Stepper</h3>
            <div className="relative pl-4 border-l-2 border-border space-y-6">
              {steps.length === 0 ? (
                <p className="text-sm text-text-secondary italic">Agrega pasos para ver la previsualización</p>
              ) : (
                steps.map((step, idx) => (
                  <div key={step.id} className="relative">
                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-surface ring-1 ring-primary"></div>
                    <div className="text-sm font-medium text-text-primary">{step.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5 capitalize">
                      {step.type === 'form' ? 'Formulario' : 'Cuestionario'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Steps Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Secuencia de Pasos</h3>
            <button
              onClick={handleAddStep}
              className="flex items-center gap-1.5 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Agregar Paso
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                totalSteps={steps.length}
                onUpdate={handleUpdateStep}
                onDelete={handleDeleteStep}
                onMove={handleMoveStep}
              />
            ))}
            
            {steps.length === 0 && (
              <div 
                onClick={handleAddStep}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-text-secondary hover:border-primary/50 hover:text-primary cursor-pointer transition-all bg-background-secondary/30"
              >
                <span className="material-symbols-outlined text-3xl mb-2">playlist_add</span>
                <p className="font-medium">No hay pasos configurados</p>
                <p className="text-sm mt-1">Haz clic para agregar el primer paso al flujo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingConfig;
