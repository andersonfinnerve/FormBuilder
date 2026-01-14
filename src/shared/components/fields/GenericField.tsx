import React from 'react';
import { FormField } from '../../../types';
import { parseRichText } from '../../utils/richText';
import { Input, TextArea } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

interface GenericFieldProps {
  field: FormField;
  onChange: (id: string, value: any) => void;
}

export const GenericField: React.FC<GenericFieldProps> = ({ field, onChange }) => {
  const renderInput = () => {
    switch (field.Type) {
      case 'textarea':
        return <TextArea rows={3} onChange={(e) => onChange(field.ComponentId, e.target.value)} />;

      case 'select':
        return (
          <Select onChange={(e) => onChange(field.ComponentId, e.target.value)}>
            <option value="">Seleccionar...</option>
            {field.Options?.map((opt, i) => <option key={i} value={opt.TextValue}>{opt.TextValue}</option>)}
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-border text-primary"
              onChange={(e) => onChange(field.ComponentId, e.target.checked)}
            />
            <label className="text-sm text-text-primary ">{field.Placeholder || 'Aceptar'}</label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.Options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={field.ComponentId}
                  className="w-4 h-4 border-border text-primary"
                  onChange={(e) => onChange(field.ComponentId, e.target.value)}
                  value={opt.TextValue}
                />
                <span className="text-sm text-text-primary ">{opt.TextValue}</span>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary bg-background">
            <span className="material-symbols-outlined text-3xl mb-2">cloud_upload</span>
            <span className="text-xs">Subir archivo</span>
          </div>
        );

      default:
        return <Input type={field.Type} onChange={(e) => onChange(field.ComponentId, e.target.value)} />;
    }
  };

  return (
    <div className={`${field.Width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-2 animate-fadeIn`}>
      <label className="block text-sm font-bold text-text-primary">
        {field.Label} {field.Required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {field.Description && <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(field.Description)} />}
    </div>
  );
};
