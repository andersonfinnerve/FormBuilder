import { SharedFieldDefinition } from '../types';

// Simulación de base de datos centralizada
export const sharedFieldsLibrary: SharedFieldDefinition[] = [
  {
    id: 'lib_nationality',
    label: 'Nacionalidad',
    type: 'select',
    options: ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'España', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Otro']
  },
  {
    id: 'lib_gender',
    label: 'Género',
    type: 'radio',
    options: ['Masculino', 'Femenino', 'No binario', 'Prefiero no decirlo']
  },
  {
    id: 'lib_currency',
    label: 'Moneda de Pago',
    type: 'select',
    options: ['USD - Dólar Estadounidense', 'EUR - Euro', 'MXN - Peso Mexicano', 'COP - Peso Colombiano', 'ARS - Peso Argentino']
  }
];
