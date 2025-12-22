import { FormField } from '../types';

export const initialFields: FormField[] = [
  {
    id: '1',
    type: 'text',
    label: 'Nombre Completo',
    placeholder: 'Ej. Juan Pérez',
    description: 'Ingrese su nombre legal como aparece en su ID.',
    required: true,
    readOnly: false,
    width: 'half',
  },
  {
    id: 'section_1',
    type: 'section',
    label: 'BENEFICIARIOS FINALES',
    description: '¿Existe alguna persona natural que pueda ser considerado como beneficiario final?',
    required: false,
    readOnly: false,
    width: 'full',
    children: [
      {
        id: 'sub_1',
        type: 'radio',
        label: '¿Con control efectivo según circular N 57/2017?',
        options: ['Sí', 'No'],
        required: true,
        readOnly: false,
        width: 'full'
      },
      {
        id: 'inner_section_1',
        type: 'section',
        label: 'PARTICIPACIÓN IGUAL O MAYOR AL 10%',
        description: 'Personas naturales que tienen una participación en la persona o estructura jurídica declarante igual o mayor al 10%.',
        required: false,
        readOnly: false,
        width: 'full',
        // Lógica: Mostrar solo si 'sub_1' es 'Sí'
        logic: {
          triggerId: 'sub_1',
          value: 'Sí',
          enabled: true
        },
        children: [
          {
            id: 'grid_1',
            type: 'grid',
            label: 'Lista de Beneficiarios',
            required: false,
            readOnly: false,
            width: 'full',
            columns: [
              { id: 'c1', label: 'País', type: 'select', required: true, sharedSource: 'lib_nationality' },
              { id: 'c2', label: 'RUT / N Doc', type: 'text', required: true },
              { id: 'c3', label: 'Nombre(s)', type: 'text', required: true }
            ]
          }
        ]
      }
    ]
  }
];
