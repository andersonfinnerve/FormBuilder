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

  // Type narrowing: selectedField es definitivamente FormField aquí
  const field: FormField = selectedField;

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdateField(field.ComponentId, key, value);
  };

  const isLayoutField = field.Type === 'spacer' || field.Type === 'divider';
  const isShared = !!field.SharedSource;
  const availableTriggers = allFields.filter(f => 
    f.ComponentId !== field.ComponentId && 
    f.Type !== 'spacer' && 
    f.Type !== 'divider' && 
    f.Type !== 'grid'
  );

  // Obtener columnas ya mapeadas (para validación)
  const getMappedColumns = (): string[] => {
    const mapped: string[] = [];
    const collectMapped = (fields: FormField[]) => {
      fields.forEach(f => {
        if (f.PhysicalColumn && f.ComponentId !== field.ComponentId) {
          mapped.push(f.PhysicalColumn);
        }
        if (f.Children) {
          collectMapped(f.Children);
        }
      });
    };
    collectMapped(allFields);
    return mapped;
  };

  const mappedColumns = getMappedColumns();

  return (
    <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex">
      <PanelHeader selectedField={field} />

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        
        {/* General Settings */}
        {!isLayoutField && (
          <GeneralSettings 
            field={field}
            isShared={isShared}
            onChange={handleChange}
            mappedColumns={mappedColumns}
          />
        )}

        {/* File Configuration */}
        {field.Type === 'file' && (
          <FileConfiguration 
            field={field}
            onChange={handleChange}
          />
        )}

        {/* Options Management */}
        {(field.Type === 'select' || field.Type === 'radio') && (
          <OptionsManagement 
            field={field}
            isShared={isShared}
            onChange={handleChange}
          />
        )}

        {/* Grid Columns Configuration */}
        {field.Type === 'grid' && (
          <GridColumnsConfig
            field={field}
            sharedLibrary={sharedLibrary}
            onChange={handleChange}
          />
        )}

        {/* Validation Rules */}
        {!isLayoutField && field.Type !== 'grid' && (
          <ValidationRules 
            field={field}
            onChange={handleChange}
          />
        )}

        {/* Conditional Logic */}
        {!isLayoutField && (
          <ConditionalLogic 
            field={field}
            availableTriggers={availableTriggers}
            onChange={handleChange}
          />
        )}

        {/* Appearance Settings */}
        {field.Type !== 'divider' && (
          <AppearanceSettings 
            field={field}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Contextual Help */}
      <ContextualHelp 
        field={field}
        isShared={isShared}
      />
    </aside>
  );
};

export default PropertiesPanel;
