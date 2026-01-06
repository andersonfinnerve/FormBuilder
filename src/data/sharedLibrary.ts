import { SharedFieldDefinition } from '../types';

// Simulación de base de datos centralizada
export const sharedFieldsLibrary: SharedFieldDefinition[] = [
  {
    id: 'lib_nationality',
    label: 'Nacionalidad',
    type: 'select',
    options: [
      { DataOptionId: 'nat_1', TextValue: 'Argentina' },
      { DataOptionId: 'nat_2', TextValue: 'Bolivia' },
      { DataOptionId: 'nat_3', TextValue: 'Brasil' },
      { DataOptionId: 'nat_4', TextValue: 'Chile' },
      { DataOptionId: 'nat_5', TextValue: 'Colombia' },
      { DataOptionId: 'nat_6', TextValue: 'Ecuador' },
      { DataOptionId: 'nat_7', TextValue: 'España' },
      { DataOptionId: 'nat_8', TextValue: 'México' },
      { DataOptionId: 'nat_9', TextValue: 'Paraguay' },
      { DataOptionId: 'nat_10', TextValue: 'Perú' },
      { DataOptionId: 'nat_11', TextValue: 'Uruguay' },
      { DataOptionId: 'nat_12', TextValue: 'Venezuela' },
      { DataOptionId: 'nat_13', TextValue: 'Otro' }
    ]
  },
  {
    id: 'lib_gender',
    label: 'Género',
    type: 'radio',
    options: [
      { DataOptionId: 'gen_1', TextValue: 'Masculino' },
      { DataOptionId: 'gen_2', TextValue: 'Femenino' },
      { DataOptionId: 'gen_3', TextValue: 'No binario' },
      { DataOptionId: 'gen_4', TextValue: 'Prefiero no decirlo' }
    ]
  },
  {
    id: 'lib_currency',
    label: 'Moneda de Pago',
    type: 'select',
    options: [
      { DataOptionId: 'cur_1', TextValue: 'USD - Dólar Estadounidense' },
      { DataOptionId: 'cur_2', TextValue: 'EUR - Euro' },
      { DataOptionId: 'cur_3', TextValue: 'MXN - Peso Mexicano' },
      { DataOptionId: 'cur_4', TextValue: 'COP - Peso Colombiano' },
      { DataOptionId: 'cur_5', TextValue: 'ARS - Peso Argentino' }
    ]
  }
];
