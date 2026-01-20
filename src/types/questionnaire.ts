export type ScoringSystem = 'weighted' | 'count';

export interface Indicator {
  id: string;
  name: string;
  value: number; // Valor numérico del indicador
  description?: string;
}

export interface Measurement {
  id: string;
  name: string;
  description?: string;
  results: ScoreRange[];
}

export interface AnswerOption {
  id: string;
  text: string;
  score: number;
  indicatorId?: string; // Indicador asignado a esta opción
}

export interface Question {
  id: string;
  text: string;
  weight: number; // Peso de la pregunta para el cálculo del puntaje
  options: AnswerOption[];
}

export interface ScoreRange {
  id: string;
  min: number;
  max: number;
  label: string; // e.g., "Conservador"
  description?: string;
  recommendation?: string;
}

// Alias for compatibility with questionnaire preview
export type QuestionnaireResult = ScoreRange;

export interface QuestionnaireConfig {
  title: string;
  description?: string;
  scoringSystem: ScoringSystem; // Sistema de puntaje: ponderado o conteo
  measurementId?: string; // ID de la medición seleccionada
  indicatorGroupId?: string; // ID del grupo de indicadores seleccionado
  indicators: Indicator[]; // Indicadores disponibles para asignar a las opciones
  questions: Question[];
  results: ScoreRange[];
}
