import React from 'react';
import { FormField } from '../../types';

interface PanelHeaderProps {
  selectedField: FormField;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ selectedField }) => {
  return (
    <div className="p-5 border-b border-border-dark flex justify-between items-center">
      <h3 className="text-white font-bold text-sm">Propiedades</h3>
      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-medium uppercase">
        {selectedField.type}
      </span>
    </div>
  );
};

export default PanelHeader;
