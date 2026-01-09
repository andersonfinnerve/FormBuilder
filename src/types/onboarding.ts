export type OnboardingStepType = 'form' | 'questionnaire' | 'document_download' | 'search';
export type FormComponentType = 'Registro' | 'Cuestionario' | 'Descarga de documentos' | 'Búsquedas';

export interface OnboardingStep {
  id: string;
  order: number;
  name: string;
  description?: string;
  componentType: FormComponentType;
  resourceId?: string; // ID del recurso asociado
}

export type PersonType = 'natural' | 'juridica';

export interface OnboardingFlow {
  id: string;
  name: string;
  personType?: PersonType;
  generatePDF: boolean;
  steps: OnboardingStep[];
  createdAt: string;
  updatedAt: string;
}
