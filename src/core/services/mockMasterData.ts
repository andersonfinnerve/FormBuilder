import { MasterData } from '../features/form-builder/components/masterData';

// Datos maestros simulados del BackOffice
export const MASTER_DATA: MasterData[] = [
  {
    FormDataId: 1,
    name: 'Actividad profesional actual',
    type: 'registry',
    options: [
      { DataOptionId: 1, value: 'Empleado' },
      { DataOptionId: 2, value: 'Autónomo' },
      { DataOptionId: 3, value: 'Empresario' },
      { DataOptionId: 4, value: 'Jubilado' },
      { DataOptionId: 5, value: 'Estudiante' },
      { DataOptionId: 6, value: 'Desempleado' },
      { DataOptionId: 7, value: 'Otro' }
    ],
    description: 'Situación laboral del contacto',
    lastModified: '2026-01-02'
  },
  {
    FormDataId: 2,
    name: 'Código Postal',
    type: 'text',
    maxLength: 10,
    description: 'Código postal de residencia',
    lastModified: '2026-01-01'
  },
  {
    FormDataId: 3,
    name: 'País de residencia',
    type: 'registry',
    options: [
      { DataOptionId: 8, value: 'Argentina' },
      { DataOptionId: 9, value: 'Chile' },
      { DataOptionId: 10, value: 'Colombia' },
      { DataOptionId: 11, value: 'España' },
      { DataOptionId: 12, value: 'México' },
      { DataOptionId: 13, value: 'Perú' },
      { DataOptionId: 14, value: 'Uruguay' },
      { DataOptionId: 15, value: 'Venezuela' }
    ],
    description: 'País donde reside el contacto',
    lastModified: '2025-12-28'
  },
  {
    FormDataId: 4,
    name: 'Nivel de estudios',
    type: 'registry',
    options: [
      { DataOptionId: 16, value: 'Primaria' },
      { DataOptionId: 17, value: 'Secundaria' },
      { DataOptionId: 18, value: 'Técnico' },
      { DataOptionId: 19, value: 'Universitario' },
      { DataOptionId: 20, value: 'Postgrado' },
      { DataOptionId: 21, value: 'Doctorado' }
    ],
    description: 'Máximo nivel educativo alcanzado',
    lastModified: '2025-12-20'
  },
  {
    FormDataId: 5,
    name: 'Estado civil',
    type: 'registry',
    options: [
      { DataOptionId: 22, value: 'Soltero/a' },
      { DataOptionId: 23, value: 'Casado/a' },
      { DataOptionId: 24, value: 'Divorciado/a' },
      { DataOptionId: 25, value: 'Viudo/a' },
      { DataOptionId: 26, value: 'Unión libre' }
    ],
    description: 'Estado civil actual',
    lastModified: '2025-12-15'
  },
  {
    FormDataId: 6,
    name: 'Referencia bancaria',
    type: 'text',
    maxLength: 50,
    description: 'Número de cuenta o referencia',
    lastModified: '2025-12-10'
  },
  {
    FormDataId: 7,
    name: 'Tipo de vivienda',
    type: 'registry',
    options: [
      { DataOptionId: 27, value: 'Propia' },
      { DataOptionId: 28, value: 'Alquilada' },
      { DataOptionId: 29, value: 'Familiar' },
      { DataOptionId: 30, value: 'Hipotecada' },
      { DataOptionId: 31, value: 'Otra' }
    ],
    description: 'Situación de la vivienda',
    lastModified: '2025-12-05'
  },
  {
    FormDataId: 8,
    name: 'Ingresos mensuales',
    type: 'registry',
    options: [
      { DataOptionId: 32, value: 'Menos de $500' },
      { DataOptionId: 33, value: '$500-$1,000' },
      { DataOptionId: 34, value: '$1,000-$2,500' },
      { DataOptionId: 35, value: '$2,500-$5,000' },
      { DataOptionId: 36, value: 'Más de $5,000' }
    ],
    description: 'Rango de ingresos mensuales',
    lastModified: '2025-11-30'
  },
  {
    FormDataId: 9,
    name: 'Nombre de emergencia',
    type: 'text',
    maxLength: 100,
    description: 'Contacto de emergencia',
    lastModified: '2025-11-25'
  },
  {
    FormDataId: 10,
    name: 'Parentesco de emergencia',
    type: 'registry',
    options: [
      { DataOptionId: 37, value: 'Padre/Madre' },
      { DataOptionId: 38, value: 'Hijo/a' },
      { DataOptionId: 39, value: 'Hermano/a' },
      { DataOptionId: 40, value: 'Cónyuge' },
      { DataOptionId: 41, value: 'Amigo/a' },
      { DataOptionId: 42, value: 'Otro familiar' }
    ],
    description: 'Relación con el contacto de emergencia',
    lastModified: '2025-11-20'
  },
  {
    FormDataId: 11,
    name: 'Beneficiarios Finales',
    type: 'grid',
    columns: [
      {
        FormDataGridColumnId: 1,
        label: 'País',
        type: 'select',
        required: true,
        options: [
          { DataOptionId: 43, value: 'Argentina' },
          { DataOptionId: 44, value: 'Chile' },
          { DataOptionId: 45, value: 'Colombia' },
          { DataOptionId: 46, value: 'España' }
        ]
      },
      {
        FormDataGridColumnId: 2,
        label: 'RUT / N° Doc',
        type: 'text',
        required: true
      },
      {
        FormDataGridColumnId: 3,
        label: 'Nombre(s)',
        type: 'text',
        required: true
      },
      {
        FormDataGridColumnId: 4,
        label: 'Porcentaje',
        type: 'text',
        required: true
      }
    ],
    description: 'Listado de beneficiarios finales con participación',
    lastModified: '2026-01-04'
  },
  {
    FormDataId: 12,
    name: '¿Qué significa para usted una inversión de largo plazo?',
    type: 'registry',
    options: [
      { DataOptionId: 47, value: 'Menor a 1 año' },
      { DataOptionId: 48, value: 'Entre 1 y 3 años' },
      { DataOptionId: 49, value: 'Entre 3 y 5 años' },
      { DataOptionId: 50, value: 'Mayor a 5 años' }
    ],
    description: 'Pregunta sobre horizonte temporal de inversión',
    lastModified: '2026-01-05'
  },
  {
    FormDataId: 13,
    name: '¿Cuál es su tolerancia al riesgo?',
    type: 'registry',
    options: [
      { DataOptionId: 51, value: 'Muy conservador' },
      { DataOptionId: 52, value: 'Conservador' },
      { DataOptionId: 53, value: 'Moderado' },
      { DataOptionId: 54, value: 'Agresivo' }
    ],
    description: 'Pregunta sobre perfil de riesgo del inversionista',
    lastModified: '2026-01-05'
  },
  {
    FormDataId: 14,
    name: '¿Cuál es su experiencia invirtiendo?',
    type: 'registry',
    options: [
      { DataOptionId: 55, value: 'Sin experiencia' },
      { DataOptionId: 56, value: 'Principiante (menos de 2 años)' },
      { DataOptionId: 57, value: 'Intermedio (2-5 años)' },
      { DataOptionId: 58, value: 'Avanzado (más de 5 años)' }
    ],
    description: 'Pregunta sobre experiencia en inversiones',
    lastModified: '2026-01-05'
  },
  {
    FormDataId: 15,
    name: '¿Qué porcentaje de sus ingresos destina a inversión?',
    type: 'registry',
    options: [
      { DataOptionId: 59, value: 'Menos del 10%' },
      { DataOptionId: 60, value: 'Entre 10% y 25%' },
      { DataOptionId: 61, value: 'Entre 25% y 50%' },
      { DataOptionId: 62, value: 'Más del 50%' }
    ],
    description: 'Pregunta sobre capacidad de ahorro e inversión',
    lastModified: '2026-01-05'
  }
];

