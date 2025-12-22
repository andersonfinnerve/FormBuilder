import React from 'react';
import { FormField, SharedFieldDefinition } from '../../types';
import EmptyState from './EmptyState';
import PanelHeader from './PanelHeader';
import GeneralSettings from './GeneralSettings';
import FileConfiguration from './FileConfiguration';
import OptionsManagement from './OptionsManagement';
import GridColumnsConfig from './GridColumnsConfig';
import ValidationRules from './ValidationRules';
import ConditionalLogic from './ConditionalLogic';
import AppearanceSettings from './AppearanceSettings';
import ContextualHelp from './ContextualHelp';

interface PropertiesPanelProps {
  selectedField: FormField | null;
  allFields: FormField[]; 
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  sharedLibrary: SharedFieldDefinition[];
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedField, 
  allFields, 
  onUpdateField, 
  sharedLibrary 
}) => {
  if (!selectedField) {
    return <EmptyState />;
  }

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdateField(selectedField.id, key, value);
  };

  const isLayoutField = selectedField.type === 'spacer' || selectedField.type === 'divider';
  const isShared = !!selectedField.sharedSource;
  const availableTriggers = allFields.filter(f => 
    f.id !== selectedField.id && 
    f.type !== 'spacer' && 
    f.type !== 'divider' && 
    f.type !== 'grid'
  );

  return (
    <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex">
      <PanelHeader selectedField={selectedField} />

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        
        {/* General Settings */}
        {!isLayoutField && (
          <GeneralSettings 
            field={selectedField}
            isShared={isShared}
            onChange={handleChange}
          />
        )}

        {/* File Configuration */}
        {selectedField.type === 'file' && (
          <FileConfiguration 
            field={selectedField}
            onChange={handleChange}
          />
        )}

        {/* Options Management */}
        {(selectedField.type === 'select' || selectedField.type === 'radio') && (
          <OptionsManagement 
            field={selectedField}
            isShared={isShared}
            onChange={handleChange}
          />
        )}

        {/* Grid Columns Configuration */}
        {selectedField.type === 'grid' && (
          <GridColumnsConfig 
            field={selectedField}
            sharedLibrary={sharedLibrary}
            onChange={handleChange}
          />
        )}

        {/* Validation Rules */}
        {!isLayoutField && selectedField.type !== 'grid' && (
          <ValidationRules 
            field={selectedField}
            onChange={handleChange}
          />
        )}

        {/* Conditional Logic */}
        {!isLayoutField && (
          <ConditionalLogic 
            field={selectedField}
            availableTriggers={availableTriggers}
            onChange={handleChange}
          />
        )}

        {/* Appearance Settings */}
        {selectedField.type !== 'divider' && (
          <AppearanceSettings 
            field={selectedField}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Contextual Help */}
      <ContextualHelp 
        field={selectedField}
        isShared={isShared}
      />
    </aside>
  );
};

export default PropertiesPanel;
