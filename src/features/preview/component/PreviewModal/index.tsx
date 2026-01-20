import React, { useState, useEffect } from 'react';
import { FormField, GridColumn, SharedFieldDefinition, FormConfig, ContactFormDataGridRow } from '@/types';
import { FormSubmission } from '@/types/formData';
import PreviewField from './PreviewField';
import SubmissionSuccess from './SubmissionSuccess';
import { Title, Button } from '@/shared/components/ui';
import { saveFormSubmission } from '@/core/services/formDataService';

interface PreviewModalProps {
  fields: FormField[];
  formConfig: FormConfig;
  onClose: () => void;
  sharedLibrary: SharedFieldDefinition[];
  formId?: string;
  onViewSubmissions?: () => void;
  preloadedData?: FormField[]; // Optional: Fields with pre-filled Values/Value
}

const PreviewModal: React.FC<PreviewModalProps> = ({ 
  fields, 
  formConfig, 
  onClose, 
  sharedLibrary,
  formId,
  onViewSubmissions,
  preloadedData
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submission, setSubmission] = useState<FormSubmission | null>(null);

  // Load preloaded data on mount
  useEffect(() => {
    if (preloadedData && preloadedData.length > 0) {
      const initialValues: Record<string, any> = {};
      extractValuesFromFields(preloadedData, initialValues);
      setFormValues(initialValues);
    }
  }, [preloadedData]);

  /**
   * Extract values from fields that have Value or Values populated
   */
  const extractValuesFromFields = (fieldsList: FormField[], target: Record<string, any>) => {
    fieldsList.forEach(field => {
      if (field.Type === 'grid' && field.Values) {
        // Convert Values (ContactFormDataGridRow[]) to simple grid format
        if (field.Columns) {
          const rows = field.Values.map(rowData => {
            const row: Record<string, string> = {};
            field.Columns!.forEach((col, colIndex) => {
              const cell = rowData.ContactFormDataGridCell[colIndex];
              row[col.Label] = cell?.TextValue || '';
            });
            return row;
          });
          target[field.ComponentId] = rows;
        }
      } else if (field.Value && field.Type !== 'section' && field.Type !== 'spacer' && field.Type !== 'divider') {
        // Regular field with Value (FormDataValue structure)
        // Extract only the TextValue for the form display
        target[field.ComponentId] = field.Value.TextValue || '';
      }

      // Recursively process children
      if (field.Children) {
        extractValuesFromFields(field.Children, target);
      }
    });
  };

  console.warn({ fields, formConfig, onClose, sharedLibrary })

  const handleChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleGridAddRow = (fieldId: string, columns: GridColumn[]) => {
    const currentRows = formValues[fieldId] || [];
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.Label]: '' }), {});
    setFormValues(prev => ({ ...prev, [fieldId]: [...currentRows, newRow] }));
  };

  const handleGridRemoveRow = (fieldId: string, rowIndex: number) => {
    const currentRows = formValues[fieldId] || [];
    const newRows = currentRows.filter((_: any, index: number) => index !== rowIndex);
    setFormValues(prev => ({ ...prev, [fieldId]: newRows }));
  };

  const handleGridCellChange = (fieldId: string, rowIndex: number, columnLabel: string, value: any) => {
    const currentRows = formValues[fieldId] || [];
    const newRows = [...currentRows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnLabel]: value };
    setFormValues(prev => ({ ...prev, [fieldId]: newRows }));
  };

  const isFieldVisible = (field: FormField) => {
    if (!field.Logic || !field.Logic.Enabled || !field.Logic.TriggerId) return true;
    const triggerValue = formValues[field.Logic.TriggerId];
    return triggerValue === field.Logic.Value;
  };

  const collectData = (nodes: FormField[], target: Record<string, any>) => {
    nodes.forEach(field => {
      if (isFieldVisible(field)) {
        if (field.Type !== 'section' && field.Type !== 'spacer' && field.Type !== 'divider') {
          target[field.ComponentId] = formValues[field.ComponentId];
        }
        if (field.Children) {
          collectData(field.Children, target);
        }
      }
    });
  };

  /**
   * Convert grid data from simple format to ContactFormDataGridRow format
   */
  const convertGridDataToBackendFormat = (
    gridData: any[], 
    columns: GridColumn[],
    formDataGridColumnIds: Map<string, number>
  ): ContactFormDataGridRow[] => {
    if (!gridData || gridData.length === 0) return [];
    
    return gridData.map(row => ({
      ContactFormDataGridRow: null, // null for new rows
      ContactFormDataGridCell: columns.map(col => ({
        ContactFormDataGridCellId: null, // null for new cells
        FormDataGridColumnId: formDataGridColumnIds.get(col.Label) || null,
        TextValue: row[col.Label] || '',
        DataOptionId: null // You could look this up if it's a select type
      }))
    }));
  };

  /**
   * Helper function to find DataOptionId for a selected value
   */
  const findDataOptionId = (field: FormField, textValue: string): number | null => {
    if (!field.Options || field.Options.length === 0) return null;
    const option = field.Options.find(opt => opt.TextValue === textValue);
    return option?.DataOptionId || null;
  };

  /**
   * Recursively populate field values in the structure
   */
  const populateFieldValues = (fieldsList: FormField[]): FormField[] => {
    return fieldsList.map(field => {
      const populatedField = { ...field };
      
      if (field.Type === 'grid') {
        // For grid fields, use Values with ContactFormDataGridRow structure
        const gridValue = formValues[field.ComponentId];
        if (gridValue && Array.isArray(gridValue) && field.Columns) {
          // Create map of column labels to FormDataGridColumnId
          const columnIdMap = new Map<string, number>();
          field.Columns.forEach(col => {
            if (col.FormDataGridColumnId) {
              columnIdMap.set(col.Label, col.FormDataGridColumnId);
            }
          });
          
          populatedField.Values = convertGridDataToBackendFormat(gridValue, field.Columns, columnIdMap);
        }
      } else if (field.Type !== 'section' && field.Type !== 'spacer' && field.Type !== 'divider') {
        // For normal fields, use Value with FormDataValue structure
        const fieldValue = formValues[field.ComponentId];
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
          populatedField.Value = {
            TextValue: String(fieldValue),
            DataOptionId: findDataOptionId(field, String(fieldValue))
          };
        }
      }
      
      // Recursively populate children
      if (field.Children) {
        populatedField.Children = populateFieldValues(field.Children);
      }
      
      return populatedField;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Collect only visible fields data (flat structure for quick access)
    const visibleValues: Record<string, any> = {};
    collectData(fields, visibleValues);
    
    // Create structure with populated values (following InitialFormStructure format)
    const populatedStructure = populateFieldValues(fields);
    
    // Create submission object following InitialFormStructure format
    const newSubmission: FormSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formId: formId || 'preview_form',
      formName: formConfig.Title || 'Formulario sin título',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      // Main structure following InitialFormStructure
      FormId: formId ? parseInt(formId) : null,
      Name: formConfig.Title || 'Formulario sin título',
      Description: formConfig.Description || '',
      StructureForm: populatedStructure,
      Config: formConfig,
      // Additional metadata
      rawData: visibleValues, // Flat values for quick access if needed
      version: 1
    };
    
    // Save to local storage using service
    try {
      saveFormSubmission(newSubmission);
      setSubmission(newSubmission);
    } catch (error) {
      console.error('Error saving form submission:', error);
      alert('Error al guardar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  const handleReset = () => {
    setFormValues({});
    setSubmission(null);
  };

  // console.log("RENDERING PREVIEW MODAL WITH FIELDS:", fields);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface bg-surface-dark w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border-dark">
        <div className="flex items-center justify-between p-4 border-b border-border-dark bg-background bg-background-dark">
          <Title title="Vista Previa del Formulario" icon="play_circle" />
          <button onClick={onClose} className="p-2 hover:bg-black/5 hover:bg-white/10 rounded-lg text-text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-surface bg-surface-dark">
          {submission ? (
            <SubmissionSuccess
              submission={submission}
              onReset={handleReset}
              onViewSubmissions={onViewSubmissions}
              onClose={onClose}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título y descripción del formulario */}
              <div className="border-b border-border-dark pb-6 mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{formConfig.Title}</h2>
                {formConfig.Description && (
                  <p className="text-text-secondary">{formConfig.Description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-text-secondary">
                    <span className="material-symbols-outlined text-4xl mb-2">block</span>
                    <p>El formulario está vacío.</p>
                  </div>
                ) : (
                  fields.map((field) => (
                    <PreviewField
                      key={field.ComponentId}
                      field={field}
                      formValues={formValues}
                      sharedLibrary={sharedLibrary}
                      onChange={handleChange}
                      onGridAddRow={handleGridAddRow}
                      onGridRemoveRow={handleGridRemoveRow}
                      onGridCellChange={handleGridCellChange}
                      isFieldVisible={isFieldVisible}
                    />
                  ))
                )}
              </div>
              {fields.length > 0 && (
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon="send"
                    label="Guardar Datos"
                  />
                </div>
              )}
            </form>
          )}
        </div>

        <div className="p-4 border-t border-border-dark bg-background bg-background-dark text-center">
          <p className="text-xs text-text-secondary">Simulación real de vista usuario.</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
