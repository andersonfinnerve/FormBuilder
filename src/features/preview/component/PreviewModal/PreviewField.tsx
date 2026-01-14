import React from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '../../../../types';
import { parseRichText } from '../../../../shared/utils/richText';
import { SectionField } from '../../../../shared/components/fields/SectionField.tsx';
import { SpacerField } from '../../../../shared/components/fields/SpacerField.tsx';
import { DividerField } from '../../../../shared/components/fields/DividerField';
import { GridField } from '../../../../shared/components/fields/GridField';
import { FileButtonField } from '../../../../shared/components/fields/FileButtonField';
import { GenericField } from '../../../../shared/components/fields/GenericField';

interface PreviewFieldProps {
  field: FormField;
  formValues: Record<string, any>;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (id: string, value: any) => void;
  onGridAddRow: (fieldId: string, columns: GridColumn[]) => void;
  onGridRemoveRow: (fieldId: string, rowIndex: number) => void;
  onGridCellChange: (fieldId: string, rowIndex: number, columnLabel: string, value: any) => void;
  isFieldVisible: (field: FormField) => boolean;
}

const PreviewField: React.FC<PreviewFieldProps> = ({
  field,
  formValues,
  sharedLibrary,
  onChange,
  onGridAddRow,
  onGridRemoveRow,
  onGridCellChange,
  isFieldVisible
}) => {
  if (!isFieldVisible(field)) return null;

  // Handle SECTION
  if (field.Type === 'section') {
    return (
      <SectionField
        field={field}
        formValues={formValues}
        sharedLibrary={sharedLibrary}
        onChange={onChange}
        onGridAddRow={onGridAddRow}
        onGridRemoveRow={onGridRemoveRow}
        onGridCellChange={onGridCellChange}
        isFieldVisible={isFieldVisible}
      />
    );
  }

  // Handle SPACER
  if (field.Type === 'spacer') {
    return <SpacerField field={field} />;
  }

  // Handle DIVIDER
  if (field.Type === 'divider') {
    return <DividerField />;
  }

  // Handle GRID
  if (field.Type === 'grid') {
    return (
      <GridField
        field={field}
        formValues={formValues}
        sharedLibrary={sharedLibrary}
        onGridAddRow={onGridAddRow}
        onGridRemoveRow={onGridRemoveRow}
        onGridCellChange={onGridCellChange}
      />
    );
  }

  // Handle FILE BUTTON
  if (field.Type === 'file' && field.FileStyle === 'button') {
    return (
      <FileButtonField
        field={field}
        formValues={formValues}
        onChange={onChange}
      />
    );
  }

  // Generic Field Render
  return <GenericField field={field} onChange={onChange} />;
};

export default PreviewField;
