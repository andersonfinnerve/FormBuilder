import React from 'react';
import { FormField } from '../../../../types';
import SubTitle from '../../../../shared/components/ui/SubTitle';
import { DividerField } from '../../../../shared/components/fields/DividerField';


interface PanelHeaderProps {
  selectedField: FormField;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ selectedField }) => {
  return (
    <div className="p-5 border-b border-border-dark flex justify-between items-center">
      <SubTitle title="Propiedades" />
      <DividerField />
      {/* <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-medium uppercase">
        {selectedField.type}
      </span> */}
    </div>
  );
};

export default PanelHeader;
