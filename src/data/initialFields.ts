import { FormField } from '../types';

export interface InitialFormStructure {
  formId: string;
  name: string;
  description: string;
  structureForm: FormField[];
}

export const initialFields: InitialFormStructure = {
  formId: 'form_beneficiarios_001',
  name: 'DECLARACIÓN DE BENEFICIARIOS FINALES',
  description: 'Formulario para declaración de beneficiarios finales',
  structureForm: [
    {
      "componentId": "1767710093975",
      "type": "text",
      "label": "Nombre",
      "placeholder": "Ej. NorGesk Blank",
      "required": false,
      "readOnly": false,
      "order": 0,
      "width": "full",
      "formDataId": null,
      "description": "nombre de inversionista.."
    },
    {
      componentId: 'section_1',
      type: 'section',
      label: 'BENEFICIARIOS FINALES',
      description: '',
      required: false,
      readOnly: false,
      order: 1,
      width: 'full',
      children: [
        {
          componentId: 'question_1',
          type: 'select',
          label: '¿EXISTE ALGUNA PERSONA NATURAL QUE PUEDA SER CONSIDERADO COMO BENEFICIARIO FINAL O CON CONTROL EFECTIVO, DE ACUERDO A LOS TÉRMINOS ESTABLECIDOS EN LA CIRCULAR N° 57/2017 DE LA UAF?',
          placeholder: 'Seleccione una opción',
          description: '*PUEDE REVISAR HACIENDO CLICK EN ESTE ANEXO LA DEFINICIÓN DE BENEFICIARIO FINAL',
          options: [
            { DataOptionId: 'opt_q1_1', TextValue: 'Si' },
            { DataOptionId: 'opt_q1_2', TextValue: 'No' }
          ],
          required: true,
          readOnly: false,
          order: 1,
          width: 'full',
          formDataId: null
        },
        {
          componentId: 'question_2',
          type: 'select',
          label: '¿EXISTEN PERSONAS NATURALES QUE TENGAN UNA PARTICIPACIÓN EN LA PERSONA O ESTRUCTURA JURÍDICA DECLARANTE IGUAL O MAYOR AL 10%?',
          placeholder: 'Seleccione una opción',
          description: '',
          options: [
            { DataOptionId: 'opt_q2_1', TextValue: 'Si' },
            { DataOptionId: 'opt_q2_2', TextValue: 'No' }
          ],
          required: true,
          readOnly: false,
          order: 2,
          width: 'full',
          formDataId: null
        }
      ]
    },
    {
      componentId: 'section_2',
      type: 'section',
      label: 'PARTICIPACIÓN IGUAL O MAYOR AL 10%',
      description: 'Personas naturales que tienen una participación en la persona o estructura jurídica declarante igual o mayor al 10%.',
      required: false,
      readOnly: false,
      order: 2,
      width: 'full',
      children: [
        {
          componentId: 'grid_beneficiarios',
          type: 'grid',
          label: '',
          description: '',
          required: false,
          readOnly: false,
          order: 1,
          width: 'full',
          formDataGridId: 'md_grid_beneficiarios',
          columns: [
            {
              id: 'col_pais',
              label: 'País',
              type: 'select',
              required: true,
              formDataGridColumnId: 'col_pais',
              options: [
                { DataOptionId: 'opt_pais_1', TextValue: 'Argentina' },
                { DataOptionId: 'opt_pais_2', TextValue: 'Chile' },
                { DataOptionId: 'opt_pais_3', TextValue: 'Colombia' },
                { DataOptionId: 'opt_pais_4', TextValue: 'España' },
                { DataOptionId: 'opt_pais_5', TextValue: 'México' },
                { DataOptionId: 'opt_pais_6', TextValue: 'Perú' }
              ]
            },
            {
              id: 'col_nacionalidad',
              label: 'Nacionalidad',
              type: 'select',
              required: true,
              formDataGridColumnId: 'col_nacionalidad',
              options: [
                { DataOptionId: 'opt_nac_1', TextValue: 'Argentina' },
                { DataOptionId: 'opt_nac_2', TextValue: 'Chilena' },
                { DataOptionId: 'opt_nac_3', TextValue: 'Colombiana' },
                { DataOptionId: 'opt_nac_4', TextValue: 'Española' },
                { DataOptionId: 'opt_nac_5', TextValue: 'Mexicana' },
                { DataOptionId: 'opt_nac_6', TextValue: 'Peruana' }
              ]
            },
            {
              id: 'col_rut',
              label: 'RUT / N° DOC',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_rut'
            },
            {
              id: 'col_nombre',
              label: 'Nombre(s)',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_nombre'
            },
            {
              id: 'col_apellido_paterno',
              label: 'Apellido paterno',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_apellido_paterno'
            },
            {
              id: 'col_apellido_materno',
              label: 'Apellido materno',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_apellido_materno'
            },
            {
              id: 'col_domicilio',
              label: 'Domicilio',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_domicilio'
            },
            {
              id: 'col_ciudad',
              label: 'Ciudad',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_ciudad'
            },
            {
              id: 'col_porcentaje',
              label: 'Porcentaje',
              type: 'text',
              required: true,
              formDataGridColumnId: 'col_porcentaje'
            }
          ]
        }
      ]
    }
  ]
};
