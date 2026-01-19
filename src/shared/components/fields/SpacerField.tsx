import React from 'react';
import { FormField } from '@/types';

interface SpacerFieldProps {
  field: FormField;
}

export const SpacerField: React.FC<SpacerFieldProps> = ({ field }) => {
  return (
    <div className={`${field.Width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} hidden md:block`}></div>
  );
};
