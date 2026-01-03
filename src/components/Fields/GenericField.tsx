import React from 'react';
import { FormField } from '../../types';
import { parseRichText } from '../../utils/richText';
import { Input, TextArea } from '../common/Input';
import { Select } from '../common/Select';

interface GenericFieldProps {
  field: FormField;
  onChange: (id: string, value: any) => void;
}

export const GenericField: React.FC<GenericFieldProps> = ({ field, onChange }) => {
  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return <TextArea rows={3} onChange={(e) => onChange(field.id, e.target.value)} />;
      
      case 'select':
        return (
          <Select onChange={(e) => onChange(field.id, e.target.value)}>
            <option value="">Seleccionar...</option>
            {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-border text-primary" 
              onChange={(e) => onChange(field.id, e.target.checked)} 
            />
            <label className="text-sm text-text-primary ">{field.placeholder || 'Aceptar'}</label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name={field.id} 
                  className="w-4 h-4 border-border text-primary" 
                  onChange={(e) => onChange(field.id, e.target.value)} 
                  value={opt} 
                />
                <span className="text-sm text-text-primary ">{opt}</span>
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
        return <Input type={field.type} onChange={(e) => onChange(field.id, e.target.value)} />;
    }
  };

  return (
    <div className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-2 animate-fadeIn`}>
      <label className="block text-sm font-bold text-text-primary">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {field.description && <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(field.description)} />}
    </div>
  );
};

