import React from 'react';
import { FormField, SharedFieldDefinition, FormConfig } from '../../types';
import EmptyState from './EmptyState';
import PanelHeader from './PanelHeader';
import GeneralSettings from './GeneralSettings';
import GeneralFormSettings from './GeneralFormSettings';
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
  formConfig: FormConfig;
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  onUpdateFormConfig: (key: keyof FormConfig, value: string) => void;
  sharedLibrary: SharedFieldDefinition[];
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedField, 
  allFields, 
  formConfig,
  onUpdateField,
  onUpdateFormConfig,
  sharedLibrary 
}) => {
  if (!selectedField) {
    return (
      <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <GeneralFormSettings 
            formConfig={formConfig}
            onUpdateFormConfig={onUpdateFormConfig}
          />
        </div>
      </aside>
    );
  }

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdateField(selectedField.componentId, key, value);
  };

  const isLayoutField = selectedField.type === 'spacer' || selectedField.type === 'divider';
  const isShared = !!selectedField.sharedSource;
  const availableTriggers = allFields.filter(f => 
    f.componentId !== selectedField.componentId && 
    f.type !== 'spacer' && 
    f.type !== 'divider' && 
    f.type !== 'grid'
  );

  // Obtener columnas ya mapeadas (para validación)
  const getMappedColumns = (): string[] => {
    const mapped: string[] = [];
    const collectMapped = (fields: FormField[]) => {
      fields.forEach(f => {
        if (f.physicalColumn && f.componentId !== selectedField.componentId) {
          mapped.push(f.physicalColumn);
        }
        if (f.children) {
          collectMapped(f.children);
        }
      });
    };
    collectMapped(allFields);
    return mapped;
  };

  const mappedColumns = getMappedColumns();

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
            mappedColumns={mappedColumns}
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
