import { OnboardingFlow } from '../types/onboarding';

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
    personType: 'natural',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [
      {
        id: 'step_1',
        order: 1,
        name: 'Datos Personales',
        type: 'form',
        resourceId: 'form_1'
      },
      {
        id: 'step_2',
        order: 2,
        name: 'Perfilamiento',
        type: 'questionnaire',
        resourceId: 'quest_1'
      }
    ]
  }
];
