import React, { useState, useEffect } from 'react';
import { OnboardingFlow, OnboardingStep, FormComponentType } from '@/types/onboarding';
import { Input, Select, ToggleSwitch } from '@/shared/components/ui';

interface OnboardingConfigProps {
  initialFlow?: OnboardingFlow | null;
  onSave: (flow: OnboardingFlow) => void;
  onCancel: () => void;
}

const componentTypeOptions: FormComponentType[] = [
  'Registro',
  'Cuestionario',
  'Descarga de documentos',
  'Búsquedas'
];

const OnboardingConfig: React.FC<OnboardingConfigProps> = ({ initialFlow, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [componentType, setComponentType] = useState<FormComponentType>('Registro');
  const [generatePDF, setGeneratePDF] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    if (initialFlow) {
      setName(initialFlow.name);
      setGeneratePDF(initialFlow.generatePDF);
      setSteps(initialFlow.steps.sort((a, b) => a.order - b.order));
      if (initialFlow.steps.length > 0) {
        setComponentType(initialFlow.steps[0].componentType);
      }
    } else {
      setName('');
      setComponentType('Registro');
      setGeneratePDF(false);
      setSteps([]);
    }
  }, [initialFlow]);

  const handleAddStep = () => {
    const newStep: OnboardingStep = {
      id: `step_${Date.now()}`,
      order: steps.length + 1,
      name: '',
      description: '',
      componentType: componentType
    };
    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (id: string, field: keyof OnboardingStep, value: any) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleDeleteStep = (id: string) => {
    const filtered = steps.filter(step => step.id !== id);
    const reordered = filtered.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    setSteps(reordered);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para la configuración');
      return;
    }

    const flow: OnboardingFlow = {
      id: initialFlow?.id || `flow_${Date.now()}`,
      name,
      generatePDF,
      steps,
      createdAt: initialFlow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(flow);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con botones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-surface rounded-full text-text-secondary transition-colors"
              title="Volver"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Config Stepper Client</h1>
              <p className="text-sm text-text-secondary mt-1">Configuración del proceso de enrolamiento del cliente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Guardar Configuración
            </button>
          </div>
        </div>

        {/* Panel Superior: Tipo de Formulario / Componente */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Tipo de Formulario / Componente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de tipo */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tipo de Componente
              </label>
              <Select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value as FormComponentType)}
                className="w-full"
              >
                {componentTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              <div className="mt-2 text-xs text-text-secondary space-y-1">
                <p>• Registro: Formularios de registro de datos</p>
                <p>• Cuestionario: Preguntas con respuestas configurables</p>
                <p>• Descarga de documentos: Descarga de archivos y plantillas</p>
                <p>• Búsquedas: Búsquedas y consultas de información</p>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Necesita saber el nombre completo"
                className="w-full"
              />
              <p className="text-xs text-text-secondary mt-2 italic">
                Ingresa un nombre descriptivo para esta configuración
              </p>
            </div>
          </div>

          {/* Toggle Genera Reporte */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Genera Reporte</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Activa esta opción para generar un PDF automático al completar el proceso
                </p>
              </div>
              <ToggleSwitch
                checked={generatePDF}
                onChange={setGeneratePDF}
              />
            </div>
          </div>
        </div>

        {/* Panel Inferior: Config Stepper Client */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Config Stepper Client</h2>
            <button
              onClick={handleAddStep}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              Agregar Paso
            </button>
          </div>

          {/* Stepper Visual */}
          <div className="flex items-center gap-4 flex-wrap">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full border-2 border-border bg-background flex items-center justify-center text-text-primary font-bold text-xl hover:border-primary transition-colors cursor-pointer">
                    {index + 1}
                  </div>

                  {/* Step Name Below */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center min-w-[120px]">
                    <p className="text-xs text-text-primary font-medium truncate px-2">
                      {step.name || 'Sin nombre'}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteStep(step.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                    title="Eliminar paso"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex items-center text-text-secondary mb-6">
                    <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Add Step Button (Circle with +) */}
            {steps.length > 0 && (
              <>
                <div className="flex items-center text-text-secondary mb-6">
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
                <button
                  onClick={handleAddStep}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-border bg-background flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors text-3xl mb-6"
                  title="Agregar paso"
                >
                  +
                </button>
              </>
            )}
          </div>

          {/* Empty State */}
          {steps.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-text-secondary">
              <span className="material-symbols-outlined text-5xl mb-3 opacity-50">timeline</span>
              <p className="font-medium text-lg">No hay pasos configurados</p>
              <p className="text-sm mt-2 mb-4">Comienza agregando el primer paso del proceso</p>
              <button
                onClick={handleAddStep}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Agregar Primer Paso
              </button>
            </div>
          )}

          {/* Step Details (if any step exists) */}
          {steps.length > 0 && (
            <div className="mt-16 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Detalles de los Pasos</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">Nombre del Paso</label>
                          <Input
                            value={step.name}
                            onChange={(e) => handleUpdateStep(step.id, 'name', e.target.value)}
                            placeholder="Ej. Ficha de cliente"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">Descripción (opcional)</label>
                          <Input
                            value={step.description || ''}
                            onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                            placeholder="Información adicional sobre este paso"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar paso"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingConfig;
