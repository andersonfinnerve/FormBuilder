import { FormField } from '../types';

export interface InitialFormStructure {
  FormId: number | null;
  Name: string;
  Description: string;
  StructureForm: FormField[];
}

export const initialFields: InitialFormStructure = {
  FormId: null,
  Name: 'DECLARACIÓN DE BENEFICIARIOS FINALES',
  Description: 'Formulario para declaración de beneficiarios finales',
  StructureForm: [
    {
      "ComponentId": "1767710093975",
      "Type": "text",
      "Label": "Nombre",
      "Placeholder": "Ej. NorGesk Blank",
      "Required": false,
      "ReadOnly": false,
      "Order": 0,
      "Width": "full",
      "FormDataId": null,
      "DataId": null,
      "Description": "nombre de inversionista.."
    },
    {
      ComponentId: 'section_1',
      Type: 'section',
      Label: 'BENEFICIARIOS FINALES',
      Description: '',
      Required: false,
      ReadOnly: false,
      Order: 1,
      Width: 'full',
      Children: [
        {
          ComponentId: 'question_1',
          Type: 'select',
          Label: '¿EXISTE ALGUNA PERSONA NATURAL QUE PUEDA SER CONSIDERADO COMO BENEFICIARIO FINAL O CON CONTROL EFECTIVO, DE ACUERDO A LOS TÉRMINOS ESTABLECIDOS EN LA CIRCULAR N° 57/2017 DE LA UAF?',
          Placeholder: 'Seleccione una opción',
          Description: '*PUEDE REVISAR HACIENDO CLICK EN ESTE ANEXO LA DEFINICIÓN DE BENEFICIARIO FINAL',
          Options: [
            { DataOptionId: null, TextValue: 'Si' },
            { DataOptionId: null, TextValue: 'No' }
          ],
          Required: true,
          ReadOnly: false,
          Order: 1,
          Width: 'full',
          DataId: null,
          FormDataId: null
        },
        {
          ComponentId: 'question_2',
          Type: 'select',
          Label: '¿EXISTEN PERSONAS NATURALES QUE TENGAN UNA PARTICIPACIÓN EN LA PERSONA O ESTRUCTURA JURÍDICA DECLARANTE IGUAL O MAYOR AL 10%?',
          Placeholder: 'Seleccione una opción',
          Description: '',
          Options: [
            { DataOptionId: null, TextValue: 'Si' },
            { DataOptionId: null, TextValue: 'No' }
          ],
          Required: true,
          ReadOnly: false,
          Order: 2,
          Width: 'full',
          DataId: null,
          FormDataId: null
        }
      ]
    },
    {
      ComponentId: 'section_2',
      Type: 'section',
      Label: 'PARTICIPACIÓN IGUAL O MAYOR AL 10%',
      Description: 'Personas naturales que tienen una participación en la persona o estructura jurídica declarante igual o mayor al 10%.',
      Required: false,
      ReadOnly: false,
      Order: 2,
      Width: 'full',
      Children: [
        {
          ComponentId: 'grid_beneficiarios',
          Type: 'grid',
          Label: '',
          Description: '',
          Required: false,
          ReadOnly: false,
          Order: 1,
          Width: 'full',
          FormDataGridId: null,
          DataGridId: null,
          Columns: [
            {
              Id: 'col_pais',
              Label: 'País',
              Type: 'select',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null,
              Options: [
                { DataOptionId: null, TextValue: 'Argentina' },
                { DataOptionId: null, TextValue: 'Chile' },
                { DataOptionId: null, TextValue: 'Colombia' },
                { DataOptionId: null, TextValue: 'España' },
                { DataOptionId: null, TextValue: 'México' },
                { DataOptionId: null, TextValue: 'Perú' }
              ]
            },
            {
              Id: 'col_nacionalidad',
              Label: 'Nacionalidad',
              Type: 'select',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null,
              Options: [
                { DataOptionId: null, TextValue: 'Argentina' },
                { DataOptionId: null, TextValue: 'Chilena' },
                { DataOptionId: null, TextValue: 'Colombiana' },
                { DataOptionId: null, TextValue: 'Española' },
                { DataOptionId: null, TextValue: 'Mexicana' },
                { DataOptionId: null, TextValue: 'Peruana' }
              ]
            },
            {
              Id: 'col_rut',
              Label: 'RUT / N° DOC',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_nombre',
              Label: 'Nombre(s)',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_apellido_paterno',
              Label: 'Apellido paterno',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_apellido_materno',
              Label: 'Apellido materno',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_domicilio',
              Label: 'Domicilio',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_ciudad',
              Label: 'Ciudad',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            },
            {
              Id: 'col_porcentaje',
              Label: 'Porcentaje',
              Type: 'text',
              Required: true,
              FormDataGridColumnId: null,
              DataGridColumnId: null,
              DataId: null
            }
          ]
        }
      ]
    }
  ]
};
