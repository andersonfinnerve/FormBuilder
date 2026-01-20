import { QuestionnaireConfig } from '../../types/questionnaire';
import { mockIndicatorGroups } from '../mock/mockQuestionnaireMasterData';

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
    scoringSystem: 'weighted', // Sistema de puntaje por defecto: ponderado
    measurementId: 'meas_perfil_riesgo', // Medición por defecto
    indicatorGroupId: 'group_perfil_riesgo', // Grupo de indicadores por defecto
    indicators: mockIndicatorGroups[0].indicators, // Indicadores del primer grupo
    questions: [
      {
        id: '1',
        text: '¿Qué significa para usted una inversión de largo plazo?',
        weight: 1, // Peso de la pregunta
        options: [
          { id: '1a', text: 'Menor a 1 año', score: 0, indicatorId: 'ind_1' },
          { id: '1b', text: 'Entre 1 y 3 años', score: 1, indicatorId: 'ind_2' },
          { id: '1c', text: 'Entre 3 y 5 años', score: 4, indicatorId: 'ind_3' },
          { id: '1d', text: 'Mayor a 5 años', score: 8, indicatorId: 'ind_4' },
        ]
      },
      {
        id: '2',
        text: '¿Cuál es su tolerancia al riesgo?',
        weight: 2, // Esta pregunta tiene más peso
        options: [
          { id: '2a', text: 'Prefiero preservar mi capital sin riesgo', score: 0, indicatorId: 'ind_1' },
          { id: '2b', text: 'Acepto bajo riesgo por algo de rentabilidad', score: 2, indicatorId: 'ind_2' },
          { id: '2c', text: 'Acepto riesgo moderado para mejor rentabilidad', score: 5, indicatorId: 'ind_3' },
          { id: '2d', text: 'Busco alta rentabilidad aunque haya alto riesgo', score: 10, indicatorId: 'ind_4' },
        ]
      },
      {
        id: '3',
        text: '¿Cuál es su experiencia invirtiendo?',
        weight: 1.5, // Peso intermedio
        options: [
          { id: '3a', text: 'Sin experiencia', score: 0, indicatorId: 'ind_1' },
          { id: '3b', text: 'Principiante (menos de 2 años)', score: 2, indicatorId: 'ind_2' },
          { id: '3c', text: 'Intermedio (2-5 años)', score: 5, indicatorId: 'ind_3' },
          { id: '3d', text: 'Avanzado (más de 5 años)', score: 8, indicatorId: 'ind_4' },
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
