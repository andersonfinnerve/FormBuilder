import { Measurement, Indicator } from '@/types/questionnaire';

// Grupos de indicadores disponibles
export interface IndicatorGroup {
  id: string;
  name: string;
  description?: string;
  indicators: Indicator[];
}

export const mockIndicatorGroups: IndicatorGroup[] = [
  {
    id: 'group_perfil_riesgo',
    name: 'Indicadores de Perfil de Riesgo',
    description: 'Indicadores para evaluar el perfil de riesgo del inversionista',
    indicators: [
      { id: 'ind_1', name: 'Uno', value: 1, description: 'Muy Conservador' },
      { id: 'ind_2', name: 'Dos', value: 2, description: 'Conservador' },
      { id: 'ind_3', name: 'Tres', value: 3, description: 'Moderado' },
      { id: 'ind_4', name: 'Cuatro', value: 4, description: 'Agresivo' },
    ]
  },
  {
    id: 'group_experiencia',
    name: 'Indicadores de Experiencia',
    description: 'Indicadores para medir el nivel de experiencia',
    indicators: [
      { id: 'exp_1', name: 'Uno', value: 1, description: 'Sin Experiencia' },
      { id: 'exp_2', name: 'Dos', value: 2, description: 'Principiante' },
      { id: 'exp_3', name: 'Tres', value: 3, description: 'Intermedio' },
      { id: 'exp_4', name: 'Cuatro', value: 4, description: 'Avanzado' },
      { id: 'exp_5', name: 'Cinco', value: 5, description: 'Experto' },
    ]
  },
  {
    id: 'group_horizonte',
    name: 'Indicadores de Horizonte Temporal',
    description: 'Indicadores para evaluar el horizonte de inversión',
    indicators: [
      { id: 'hor_1', name: 'Uno', value: 1, description: 'Corto Plazo' },
      { id: 'hor_2', name: 'Dos', value: 2, description: 'Mediano Plazo' },
      { id: 'hor_3', name: 'Tres', value: 3, description: 'Largo Plazo' },
      { id: 'hor_4', name: 'Cuatro', value: 4, description: 'Muy Largo Plazo' },
    ]
  },
  {
    id: 'group_capacidad',
    name: 'Indicadores de Capacidad de Ahorro',
    description: 'Indicadores para medir la capacidad de inversión',
    indicators: [
      { id: 'cap_1', name: 'Uno', value: 1, description: 'Baja' },
      { id: 'cap_2', name: 'Dos', value: 2, description: 'Media' },
      { id: 'cap_3', name: 'Tres', value: 3, description: 'Alta' },
      { id: 'cap_4', name: 'Cuatro', value: 4, description: 'Muy Alta' },
    ]
  }
];

// Mock de indicadores individuales (legacy - para compatibilidad)
export const mockIndicators: Indicator[] = mockIndicatorGroups[0].indicators;

// Mock de mediciones disponibles
export const mockMeasurements: Measurement[] = [
  {
    id: 'meas_perfil_riesgo',
    name: 'Perfil de Riesgo',
    description: 'Medición del perfil de riesgo del inversionista',
    results: [
      { id: 'r1', min: 0, max: 8, label: 'Muy Conservador', description: 'Perfil de bajo riesgo, prefiere inversiones seguras' },
      { id: 'r2', min: 9, max: 15, label: 'Conservador', description: 'Perfil moderado-bajo, acepta riesgo mínimo' },
      { id: 'r3', min: 16, max: 22, label: 'Moderado', description: 'Perfil equilibrado entre riesgo y rentabilidad' },
      { id: 'r4', min: 23, max: 100, label: 'Agresivo', description: 'Perfil de alto riesgo, busca máxima rentabilidad' },
    ]
  },
  {
    id: 'meas_satisfaccion',
    name: 'Nivel de Satisfacción',
    description: 'Medición del nivel de satisfacción del cliente',
    results: [
      { id: 'r1', min: 0, max: 25, label: 'Insatisfecho', description: 'Cliente con baja satisfacción' },
      { id: 'r2', min: 26, max: 50, label: 'Neutral', description: 'Cliente con satisfacción media' },
      { id: 'r3', min: 51, max: 75, label: 'Satisfecho', description: 'Cliente con alta satisfacción' },
      { id: 'r4', min: 76, max: 100, label: 'Muy Satisfecho', description: 'Cliente altamente satisfecho' },
    ]
  },
  {
    id: 'meas_conocimiento',
    name: 'Nivel de Conocimiento Financiero',
    description: 'Evaluación del conocimiento financiero del cliente',
    results: [
      { id: 'r1', min: 0, max: 30, label: 'Principiante', description: 'Conocimiento básico de finanzas' },
      { id: 'r2', min: 31, max: 60, label: 'Intermedio', description: 'Conocimiento moderado de finanzas' },
      { id: 'r3', min: 61, max: 85, label: 'Avanzado', description: 'Conocimiento avanzado de finanzas' },
      { id: 'r4', min: 86, max: 100, label: 'Experto', description: 'Conocimiento experto en finanzas' },
    ]
  },
  {
    id: 'meas_afinidad_digital',
    name: 'Afinidad Digital',
    description: 'Medición de la capacidad y preferencia por canales digitales',
    results: [
      { id: 'r1', min: 0, max: 20, label: 'Baja', description: 'Prefiere canales presenciales' },
      { id: 'r2', min: 21, max: 50, label: 'Media', description: 'Usa canales digitales ocasionalmente' },
      { id: 'r3', min: 51, max: 80, label: 'Alta', description: 'Prefiere canales digitales' },
      { id: 'r4', min: 81, max: 100, label: 'Muy Alta', description: 'Usuario digital avanzado' },
    ]
  }
];
