import React from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '../../../types';
import { parseRichText } from '../../utils/richText';
import PreviewField from '../../../features/preview/component/PreviewModal/PreviewField';
import SubTitle from '../ui/SubTitle';
import Title from '../ui/Title';

interface SectionFieldProps {
  field: FormField;
  formValues: Record<string, any>;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (id: string, value: any) => void;
  onGridAddRow: (fieldId: string, columns: GridColumn[]) => void;
  onGridRemoveRow: (fieldId: string, rowIndex: number) => void;
  onGridCellChange: (fieldId: string, rowIndex: number, columnLabel: string, value: any) => void;
  isFieldVisible: (field: FormField) => boolean;
}

console.error("PEPE LUCHO");

export const SectionField: React.FC<SectionFieldProps> = ({
  field,
  formValues,
  sharedLibrary,
  onChange,
  onGridAddRow,
  onGridRemoveRow,
  onGridCellChange,
  isFieldVisible
}) => {
  return (
    <div className={`${field.Width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} border border-border rounded-xl p-6 bg-surface space-y-4 animate-fadeIn`}>
      <div className="border-b border-border pb-2">
        {/* <h3 className="text-lg font-bold text-text-primary uppercase tracking-wide">
          {field.Label}
        </h3> */}
        <Title title={field.Label} />
        {field.Description && (
          <div className="text-sm text-text-secondary mt-1" dangerouslySetInnerHTML={parseRichText(field.Description)} />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {field.Children?.map(child => (
          <PreviewField
            key={child.ComponentId}
            field={child}
            formValues={formValues}
            sharedLibrary={sharedLibrary}
            onChange={onChange}
            onGridAddRow={onGridAddRow}
            onGridRemoveRow={onGridRemoveRow}
            onGridCellChange={onGridCellChange}
            isFieldVisible={isFieldVisible}
          />
        ))}
      </div>
    </div>
  );
};
