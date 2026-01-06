import { QuestionnaireConfig } from '../types/questionnaire';

export interface InitialQuestionnaireStructure {
  formId: string;
  name: string;
  description: string;
  structureQuestionnaire: QuestionnaireConfig;
}

export const initialQuestionnaire: InitialQuestionnaireStructure = {
  formId: 'questionnaire_initial_001',
  name: 'Perfil de Inversionista',
  description: 'Cuestionario para determinar el perfil de riesgo del cliente.',
  structureQuestionnaire: {
    title: 'Perfil de Inversionista',
    description: 'Cuestionario para determinar el perfil de riesgo del cliente.',
    questions: [
      {
        id: '1',
        text: '¿Qué significa para usted una inversión de largo plazo?',
        options: [
          { id: '1a', text: 'Menor a 1 año', score: 0 },
          { id: '1b', text: 'Entre 1 y 3 años', score: 1 },
          { id: '1c', text: 'Entre 3 y 5 años', score: 4 },
          { id: '1d', text: 'Mayor a 5 años', score: 8 },
        ]
      },
      {
        id: '2',
        text: '¿Cuál es su tolerancia al riesgo?',
        options: [
          { id: '2a', text: 'Prefiero preservar mi capital sin riesgo', score: 0 },
          { id: '2b', text: 'Acepto bajo riesgo por algo de rentabilidad', score: 2 },
          { id: '2c', text: 'Acepto riesgo moderado para mejor rentabilidad', score: 5 },
          { id: '2d', text: 'Busco alta rentabilidad aunque haya alto riesgo', score: 10 },
        ]
      },
      {
        id: '3',
        text: '¿Cuál es su experiencia invirtiendo?',
        options: [
          { id: '3a', text: 'Sin experiencia', score: 0 },
          { id: '3b', text: 'Principiante (menos de 2 años)', score: 2 },
          { id: '3c', text: 'Intermedio (2-5 años)', score: 5 },
          { id: '3d', text: 'Avanzado (más de 5 años)', score: 8 },
        ]
      }
    ],
    results: [
      { id: 'r1', min: 0, max: 8, label: 'Muy Conservador', description: 'Perfil de bajo riesgo, prefiere inversiones seguras' },
      { id: 'r2', min: 9, max: 15, label: 'Conservador', description: 'Perfil moderado-bajo, acepta riesgo mínimo' },
      { id: 'r3', min: 16, max: 22, label: 'Moderado', description: 'Perfil equilibrado entre riesgo y rentabilidad' },
      { id: 'r4', min: 23, max: 100, label: 'Agresivo', description: 'Perfil de alto riesgo, busca máxima rentabilidad' },
    ]
  }
};
