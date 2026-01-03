import { MasterData } from '../types/masterData';

// Datos maestros simulados del BackOffice
export const MASTER_DATA: MasterData[] = [
  {
    id: 'md_001',
    name: 'Actividad profesional actual',
    type: 'registry',
    options: ['Empleado', 'Autónomo', 'Empresario', 'Jubilado', 'Estudiante', 'Desempleado', 'Otro'],
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
    options: ['Argentina', 'Chile', 'Colombia', 'España', 'México', 'Perú', 'Uruguay', 'Venezuela'],
    description: 'País donde reside el contacto',
    lastModified: '2025-12-28'
  },
  {
    id: 'md_004',
    name: 'Nivel de estudios',
    type: 'registry',
    options: ['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado', 'Doctorado'],
    description: 'Máximo nivel educativo alcanzado',
    lastModified: '2025-12-20'
  },
  {
    id: 'md_005',
    name: 'Estado civil',
    type: 'registry',
    options: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión libre'],
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
    options: ['Propia', 'Alquilada', 'Familiar', 'Hipotecada', 'Otra'],
    description: 'Situación de la vivienda',
    lastModified: '2025-12-05'
  },
  {
    id: 'md_008',
    name: 'Ingresos mensuales',
    type: 'registry',
    options: ['Menos de $500', '$500-$1,000', '$1,000-$2,500', '$2,500-$5,000', 'Más de $5,000'],
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
    options: ['Padre/Madre', 'Hijo/a', 'Hermano/a', 'Cónyuge', 'Amigo/a', 'Otro familiar'],
    description: 'Relación con el contacto de emergencia',
    lastModified: '2025-11-20'
  }
];
