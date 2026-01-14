import { OnboardingFlow } from '../../types/onboarding';

export const mockForms = [
  { id: 'form_1', name: 'Ficha de Cliente (Natural)' },
  { id: 'form_2', name: 'Declaración de Origen de Fondos' },
  { id: 'form_3', name: 'Ficha de Empresa (Jurídica)' },
];

export const mockQuestionnaires = [
  { id: 'quest_1', name: 'Perfil de Inversionista' },
  { id: 'quest_2', name: 'Evaluación de Conocimientos Financieros' },
  { id: 'quest_3', name: 'Test de Idoneidad' },
];

export const initialOnboardingFlows: OnboardingFlow[] = [
  {
    id: 'flow_1',
    name: 'Onboarding Inversionista Natural',
    generatePDF: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: 'step_1',
        order: 1,
        name: 'Ficha de cliente',
        description: 'Datos personales del inversionista',
        componentType: 'Registro',
        resourceId: 'form_1'
      },
      {
        id: 'step_2',
        order: 2,
        name: 'Perfilamiento',
        description: 'Evaluación del perfil de riesgo',
        componentType: 'Cuestionario',
        resourceId: 'quest_1'
      }
    ]
  },
  {
    id: 'flow_2',
    name: 'Onboarding Empresa',
    generatePDF: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: 'step_1',
        order: 1,
        name: 'Datos de la empresa',
        description: 'Información corporativa',
        componentType: 'Registro',
        resourceId: 'form_3'
      }
    ]
  }
];
