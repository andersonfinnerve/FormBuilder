export interface AnswerOption {
  id: string;
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface ScoreRange {
  id: string;
  min: number;
  max: number;
  label: string; // e.g., "Conservador"
  description?: string;
}

export interface QuestionnaireConfig {
  title: string;
  description?: string;
  questions: Question[];
  results: ScoreRange[];
}
