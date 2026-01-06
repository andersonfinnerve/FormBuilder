import { MasterData } from '../types/masterData';

// Datos maestros simulados del BackOffice
export const MASTER_DATA: MasterData[] = [
  {
    id: 'md_001',
    name: 'Actividad profesional actual',
    type: 'registry',
    options: [
      { id: 'opt_001_1', value: 'Empleado' },
      { id: 'opt_001_2', value: 'Autónomo' },
      { id: 'opt_001_3', value: 'Empresario' },
      { id: 'opt_001_4', value: 'Jubilado' },
      { id: 'opt_001_5', value: 'Estudiante' },
      { id: 'opt_001_6', value: 'Desempleado' },
      { id: 'opt_001_7', value: 'Otro' }
    ],
    description: 'Situación laboral del contacto',
    lastModified: '2026-01-02'
  },
  {
    id: 'md_002',
    name: 'Código Postal',
    type: 'text',
    maxLength: 10,
    description: 'Código postal de residencia',
    lastModified: '2026-01-01'
  },
  {
    id: 'md_003',
    name: 'País de residencia',
    type: 'registry',
    options: [
      { id: 'opt_003_1', value: 'Argentina' },
      { id: 'opt_003_2', value: 'Chile' },
      { id: 'opt_003_3', value: 'Colombia' },
      { id: 'opt_003_4', value: 'España' },
      { id: 'opt_003_5', value: 'México' },
      { id: 'opt_003_6', value: 'Perú' },
      { id: 'opt_003_7', value: 'Uruguay' },
      { id: 'opt_003_8', value: 'Venezuela' }
    ],
    description: 'País donde reside el contacto',
    lastModified: '2025-12-28'
  },
  {
    id: 'md_004',
    name: 'Nivel de estudios',
    type: 'registry',
    options: [
      { id: 'opt_004_1', value: 'Primaria' },
      { id: 'opt_004_2', value: 'Secundaria' },
      { id: 'opt_004_3', value: 'Técnico' },
      { id: 'opt_004_4', value: 'Universitario' },
      { id: 'opt_004_5', value: 'Postgrado' },
      { id: 'opt_004_6', value: 'Doctorado' }
    ],
    description: 'Máximo nivel educativo alcanzado',
    lastModified: '2025-12-20'
  },
  {
    id: 'md_005',
    name: 'Estado civil',
    type: 'registry',
    options: [
      { id: 'opt_005_1', value: 'Soltero/a' },
      { id: 'opt_005_2', value: 'Casado/a' },
      { id: 'opt_005_3', value: 'Divorciado/a' },
      { id: 'opt_005_4', value: 'Viudo/a' },
      { id: 'opt_005_5', value: 'Unión libre' }
    ],
    description: 'Estado civil actual',
    lastModified: '2025-12-15'
  },
  {
    id: 'md_006',
    name: 'Referencia bancaria',
    type: 'text',
    maxLength: 50,
    description: 'Número de cuenta o referencia',
    lastModified: '2025-12-10'
  },
  {
    id: 'md_007',
    name: 'Tipo de vivienda',
    type: 'registry',
    options: [
      { id: 'opt_007_1', value: 'Propia' },
      { id: 'opt_007_2', value: 'Alquilada' },
      { id: 'opt_007_3', value: 'Familiar' },
      { id: 'opt_007_4', value: 'Hipotecada' },
      { id: 'opt_007_5', value: 'Otra' }
    ],
    description: 'Situación de la vivienda',
    lastModified: '2025-12-05'
  },
  {
    id: 'md_008',
    name: 'Ingresos mensuales',
    type: 'registry',
    options: [
      { id: 'opt_008_1', value: 'Menos de $500' },
      { id: 'opt_008_2', value: '$500-$1,000' },
      { id: 'opt_008_3', value: '$1,000-$2,500' },
      { id: 'opt_008_4', value: '$2,500-$5,000' },
      { id: 'opt_008_5', value: 'Más de $5,000' }
    ],
    description: 'Rango de ingresos mensuales',
    lastModified: '2025-11-30'
  },
  {
    id: 'md_009',
    name: 'Nombre de emergencia',
    type: 'text',
    maxLength: 100,
    description: 'Contacto de emergencia',
    lastModified: '2025-11-25'
  },
  {
    id: 'md_010',
    name: 'Parentesco de emergencia',
    type: 'registry',
    options: [
      { id: 'opt_010_1', value: 'Padre/Madre' },
      { id: 'opt_010_2', value: 'Hijo/a' },
      { id: 'opt_010_3', value: 'Hermano/a' },
      { id: 'opt_010_4', value: 'Cónyuge' },
      { id: 'opt_010_5', value: 'Amigo/a' },
      { id: 'opt_010_6', value: 'Otro familiar' }
    ],
    description: 'Relación con el contacto de emergencia',
    lastModified: '2025-11-20'
  },
  {
    id: 'md_grid_001',
    name: 'Beneficiarios Finales',
    type: 'grid',
    columns: [
      {
        id: 'col_001',
        label: 'País',
        type: 'select',
        required: true,
        options: [
          { id: 'opt_col_001_1', value: 'Argentina' },
          { id: 'opt_col_001_2', value: 'Chile' },
          { id: 'opt_col_001_3', value: 'Colombia' },
          { id: 'opt_col_001_4', value: 'España' }
        ]
      },
      {
        id: 'col_002',
        label: 'RUT / N° Doc',
        type: 'text',
        required: true
      },
      {
        id: 'col_003',
        label: 'Nombre(s)',
        type: 'text',
        required: true
      },
      {
        id: 'col_004',
        label: 'Porcentaje',
        type: 'text',
        required: true
      }
    ],
    description: 'Listado de beneficiarios finales con participación',
    lastModified: '2026-01-04'
  },
  {
    id: 'md_questionnaire_001',
    name: '¿Qué significa para usted una inversión de largo plazo?',
    type: 'registry',
    options: [
      { id: 'opt_q001_1', value: 'Menor a 1 año' },
      { id: 'opt_q001_2', value: 'Entre 1 y 3 años' },
      { id: 'opt_q001_3', value: 'Entre 3 y 5 años' },
      { id: 'opt_q001_4', value: 'Mayor a 5 años' }
    ],
    description: 'Pregunta sobre horizonte temporal de inversión',
    lastModified: '2026-01-05'
  },
  {
    id: 'md_questionnaire_002',
    name: '¿Cuál es su tolerancia al riesgo?',
    type: 'registry',
    options: [
      { id: 'opt_q002_1', value: 'Muy conservador' },
      { id: 'opt_q002_2', value: 'Conservador' },
      { id: 'opt_q002_3', value: 'Moderado' },
      { id: 'opt_q002_4', value: 'Agresivo' }
    ],
    description: 'Pregunta sobre perfil de riesgo del inversionista',
    lastModified: '2026-01-05'
  },
  {
    id: 'md_questionnaire_003',
    name: '¿Cuál es su experiencia invirtiendo?',
    type: 'registry',
    options: [
      { id: 'opt_q003_1', value: 'Sin experiencia' },
      { id: 'opt_q003_2', value: 'Principiante (menos de 2 años)' },
      { id: 'opt_q003_3', value: 'Intermedio (2-5 años)' },
      { id: 'opt_q003_4', value: 'Avanzado (más de 5 años)' }
    ],
    description: 'Pregunta sobre experiencia en inversiones',
    lastModified: '2026-01-05'
  },
  {
    id: 'md_questionnaire_004',
    name: '¿Qué porcentaje de sus ingresos destina a inversión?',
    type: 'registry',
    options: [
      { id: 'opt_q004_1', value: 'Menos del 10%' },
      { id: 'opt_q004_2', value: 'Entre 10% y 25%' },
      { id: 'opt_q004_3', value: 'Entre 25% y 50%' },
      { id: 'opt_q004_4', value: 'Más del 50%' }
    ],
    description: 'Pregunta sobre capacidad de ahorro e inversión',
    lastModified: '2026-01-05'
  }
];

