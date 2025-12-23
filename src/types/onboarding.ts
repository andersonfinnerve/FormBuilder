export type OnboardingStepType = 'form' | 'questionnaire';

export interface OnboardingStep {
  id: string;
  order: number;
  name: string;
  type: OnboardingStepType;
  resourceId: string; // ID del Formulario o Cuestionario seleccionado
}

export type PersonType = 'natural' | 'juridica';

export interface OnboardingFlow {
  id: string;
  name: string;
  personType: PersonType;
  steps: OnboardingStep[];
  createdAt: string;
  updatedAt: string;
}
