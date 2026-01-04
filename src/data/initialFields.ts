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
    order: 1,
    width: 'half',
    formDataId: null, // Campo manual - null indica que debe crearse en el maestro
  },
  {
    id: '2',
    type: 'text',
    label: 'Código Postal',
    placeholder: '',
    description: 'Código postal de residencia',
    required: false,
    readOnly: false,
    order: 2,
    width: 'half',
    formDataId: 'md_002', // Campo de texto del maestro - SÍ tiene formDataId
  },
  {
    id: '3',
    type: 'select',
    label: 'Actividad profesional actual',
    placeholder: 'Seleccione una opción...',
    description: 'Situación laboral del contacto',
    required: false,
    readOnly: false,
    order: 3,
    width: 'half',
    options: ['Empleado', 'Autónomo', 'Empresario', 'Jubilado', 'Estudiante', 'Desempleado', 'Otro'],
    formDataId: 'md_001', // Campo select del maestro - SÍ tiene formDataId
    formDataOptions: [
      { value: 'Empleado', formDataOptionId: 'opt_001_1' },
      { value: 'Autónomo', formDataOptionId: 'opt_001_2' },
      { value: 'Empresario', formDataOptionId: 'opt_001_3' },
      { value: 'Jubilado', formDataOptionId: 'opt_001_4' },
      { value: 'Estudiante', formDataOptionId: 'opt_001_5' },
      { value: 'Desempleado', formDataOptionId: 'opt_001_6' },
      { value: 'Otro', formDataOptionId: 'opt_001_7' }
    ]
  },
  {
    id: 'section_1',
    type: 'section',
    label: 'BENEFICIARIOS FINALES',
    description: '¿Existe alguna persona natural que pueda ser considerado como beneficiario final?',
    required: false,
    readOnly: false,
    order: 2,
    width: 'full',
    children: [
      {
        id: 'sub_1',
        type: 'radio',
        label: '¿Con control efectivo según circular N 57/2017?',
        options: ['Sí', 'No'],
        required: true,
        readOnly: false,
        order: 1,
        width: 'full'
      },
      {
        id: 'inner_section_1',
        type: 'section',
        label: 'PARTICIPACIÓN IGUAL O MAYOR AL 10%',
        description: 'Personas naturales que tienen una participación en la persona o estructura jurídica declarante igual o mayor al 10%.',
        required: false,
        readOnly: false,
        order: 2,
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
            description: 'Listado de beneficiarios finales con participación',
            required: false,
            readOnly: false,
            order: 1,
            width: 'full',
            formDataGridId: 'md_grid_001', // Grid del maestro
            columns: [
              {
                id: 'col_001',
                label: 'País',
                type: 'select',
                required: true,
                formDataGridColumnId: 'col_001',
                formDataOptions: [
                  { value: 'Argentina', formDataOptionId: 'opt_col_001_1' },
                  { value: 'Chile', formDataOptionId: 'opt_col_001_2' },
                  { value: 'Colombia', formDataOptionId: 'opt_col_001_3' },
                  { value: 'España', formDataOptionId: 'opt_col_001_4' }
                ]
              },
              {
                id: 'col_002',
                label: 'RUT / N° Doc',
                type: 'text',
                required: true,
                formDataGridColumnId: 'col_002'
              },
              {
                id: 'col_003',
                label: 'Nombre(s)',
                type: 'text',
                required: true,
                formDataGridColumnId: 'col_003'
              },
              {
                id: 'col_004',
                label: 'Porcentaje',
                type: 'text',
                required: true,
                formDataGridColumnId: 'col_004'
              }
            ]
          }
        ]
      }
    ]
  }
];
