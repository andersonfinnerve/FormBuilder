import React, { useState } from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '../../types';
import PreviewField from './PreviewField';

interface PreviewModalProps {
  fields: FormField[];
  onClose: () => void;
  sharedLibrary: SharedFieldDefinition[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ fields, onClose, sharedLibrary }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<string | null>(null);

  const handleChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleGridAddRow = (fieldId: string, columns: GridColumn[]) => {
    const currentRows = formValues[fieldId] || [];
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.label]: '' }), {});
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
    if (!field.logic || !field.logic.enabled || !field.logic.triggerId) return true;
    const triggerValue = formValues[field.logic.triggerId];
    return triggerValue === field.logic.value;
  };

  const collectData = (nodes: FormField[], target: Record<string, any>) => {
    nodes.forEach(field => {
      if (isFieldVisible(field)) {
        if (field.type !== 'section' && field.type !== 'spacer' && field.type !== 'divider') {
          target[field.id] = formValues[field.id];
        }
        if (field.children) {
          collectData(field.children, target);
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visibleValues: Record<string, any> = {};
    collectData(fields, visibleValues);
    setSubmittedData(JSON.stringify(visibleValues, null, 2));
  };

  console.log("RENDERING PREVIEW MODAL WITH FIELDS:", fields);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface bg-surface-dark w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border-dark">
        <div className="flex items-center justify-between p-4 border-b border-border-dark bg-background bg-background-dark">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            Vista Previa del Formulario
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 hover:bg-white/10 rounded-lg text-text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-surface bg-surface-dark">
          {submittedData ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 text-green-400 p-4 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <div>
                  <h3 className="font-bold">¡Formulario enviado con éxito!</h3>
                  <p className="text-sm opacity-90">Los datos se han procesado correctamente.</p>
                </div>
              </div>
              <div className="bg-background bg-background-dark p-4 rounded-lg border border-border-dark">
                <pre className="text-xs font-mono text-text-primary text-gray-300 overflow-x-auto whitespace-pre-wrap">{submittedData}</pre>
              </div>
              <button onClick={() => setSubmittedData(null)} className="text-primary hover:underline text-sm font-medium">Volver al formulario</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-text-secondary">
                    <span className="material-symbols-outlined text-4xl mb-2">block</span>
                    <p>El formulario está vacío.</p>
                  </div>
                ) : (
                  fields.map((field) => (
                    <PreviewField
                      key={field.id}
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
                  <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">
                    Enviar Datos
                  </button>
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
