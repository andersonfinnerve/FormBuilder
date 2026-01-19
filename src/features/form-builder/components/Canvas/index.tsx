import React from 'react';
import { FormField, FieldType, DropPosition, FormConfig } from '@/types';
import CanvasToolbar from './CanvasToolbar';
import FieldRenderer from './FieldRenderer';

interface CanvasProps {
  fieldsSettings: FormField[];
  selectedId: string | null;
  formConfig: FormConfig;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string, e: React.MouseEvent) => void;
  onDuplicateField: (field: FormField, e: React.MouseEvent) => void;
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  onMoveField: (dragId: string, targetId: string, position: DropPosition) => void;
  onDropNewField: (type: FieldType, targetId: string, position: DropPosition, sharedId?: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  fields,
  selectedId,
  formConfig,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onUpdateField,
  onMoveField,
  onDropNewField
}) => {
  // Root level drop handler
    const fieldsSettings: FormField[] = fields;

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const newFieldType = e.dataTransfer.getData("application/newFieldType") as FieldType;
    if (newFieldType) {
      if (e.target === e.currentTarget) {
        const lastField = fieldsSettings[fieldsSettings.length - 1];
        const targetId = lastField ? lastField.ComponentId : 'ROOT_START';
        const sharedId = e.dataTransfer.getData("application/sharedId");

        onDropNewField(newFieldType, targetId, 'after', sharedId || undefined);
      }
      return;
    }

    const dragId = e.dataTransfer.getData("application/fieldId");
    if (!dragId) return;

    if (e.target === e.currentTarget) {
      const lastField = fieldsSettings[fieldsSettings.length - 1];
      if (lastField) {
        onMoveField(dragId, lastField.ComponentId, 'after');
      }
    }
  };

  return (
    <section
      className="flex-1 bg-background-dark relative overflow-hidden flex flex-col"
      onClick={() => onSelectField('')}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleRootDrop}
    >
      {/* <CanvasToolbar /> */}

      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex justify-center custom-scrollbar">
        <div
          className="w-full h-fit bg-surface-dark border border-border-dark rounded-xl shadow-2xl relative transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-3 w-full bg-gradient-to-r from-blue-600 via-primary to-cyan-400 rounded-t-xl"></div>

          <div className="p-6 md:p-10 space-y-8">
            <div className="group relative border-b border-border-dark pb-6 hover:bg-background-dark/30 -mx-4 px-4 rounded-lg transition-colors cursor-pointer">
              <h1 className="text-3xl font-bold text-text-primary mb-2">{formConfig.Title}</h1>
              {formConfig.Description && (
                <p className="text-text-secondary">{formConfig.Description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px] content-start">
              {fieldsSettings.map((field) => (
                <FieldRenderer
                  key={field.ComponentId}
                  field={field}
                  selectedId={selectedId}
                  onSelectField={onSelectField}
                  onDeleteField={onDeleteField}
                  onDuplicateField={onDuplicateField}
                  onUpdateField={onUpdateField}
                  onMoveField={onMoveField}
                  onDropNewField={onDropNewField}
                />
              ))}

              {fieldsSettings.length === 0 && (
                <div className="md:col-span-2 h-48 border-2 border-dashed border-border-dark rounded-lg flex flex-col items-center justify-center text-text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2">post_add</span>
                  <p>Arrastra elementos aquí para comenzar</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-border-dark bg-background-dark/30 rounded-b-xl flex justify-between items-center">
            <div className="text-xs text-text-secondary">Desarrollado por FormBuilder Pro</div>
            <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg opacity-50 cursor-not-allowed">Enviar</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Canvas;
