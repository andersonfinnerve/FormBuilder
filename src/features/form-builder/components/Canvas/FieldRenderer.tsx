import React, { useState } from 'react';
import { FormField, FieldType, DropPosition, DragOverPosition } from '@/types';
import { parseRichText } from '@/shared/utils';
import DragDropIndicators from './DragDropIndicators';
import FieldActions from './FieldActions';
import FieldIndicators from './FieldIndicators';
import ResizeHandle from './ResizeHandle';
import FieldInput from './FieldInput';

interface FieldRendererProps {
  field: FormField;
  selectedId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string, e: React.MouseEvent) => void;
  onDuplicateField: (field: FormField, e: React.MouseEvent) => void;
  onUpdateField: (id: string, key: keyof FormField, value: any) => void;
  onMoveField: (dragId: string, targetId: string, position: DropPosition) => void;
  onDropNewField: (type: FieldType, targetId: string, position: DropPosition, sharedId?: string) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  selectedId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onUpdateField,
  onMoveField,
  onDropNewField
}) => {
  const fieldSettings: FormField = field;

  const isSelected = selectedId === fieldSettings.ComponentId;
  const [dragOverPosition, setDragOverPosition] = useState<DragOverPosition>(null);

  // Características del campo
  const isSpacer = fieldSettings.Type === 'spacer';
  const isDivider = fieldSettings.Type === 'divider';
  const isSection = fieldSettings.Type === 'section';
  const isShared = !!fieldSettings.SharedSource;
  const hasLogic = fieldSettings.Logic?.Enabled && fieldSettings.Logic?.TriggerId;
  const isButtonStyleFile = fieldSettings.Type === 'file' && fieldSettings.FileStyle === 'button';

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/fieldId", fieldSettings.ComponentId);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const clientY = e.clientY;
    const height = rect.height;

    if (fieldSettings.Type === 'section') {
      const relativeY = clientY - rect.top;
      if (relativeY < height * 0.25) {
        setDragOverPosition('top');
      } else if (relativeY > height * 0.75) {
        setDragOverPosition('bottom');
      } else {
        setDragOverPosition('inside');
      }
    } else {
      const relativeY = clientY - rect.top;
      if (relativeY < height / 2) {
        setDragOverPosition('top');
      } else {
        setDragOverPosition('bottom');
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);

    let position: DropPosition = 'after';
    if (dragOverPosition === 'top') position = 'before';
    if (dragOverPosition === 'inside') position = 'inside';

    const newFieldType = e.dataTransfer.getData("application/newFieldType") as FieldType;
    if (newFieldType) {
      const sharedId = e.dataTransfer.getData("application/sharedId");
      onDropNewField(newFieldType, fieldSettings.ComponentId, position, sharedId || undefined);
      return;
    }

    const dragId = e.dataTransfer.getData("application/fieldId");
    if (dragId && dragId !== fieldSettings.ComponentId) {
      onMoveField(dragId, fieldSettings.ComponentId, position);
    }
  };

  const handleUpdateWidth = (id: string, width: 'full' | 'half') => {
    onUpdateField(id, 'Width', width);
  };

  // Render del contenido de una sección
  const renderSectionContent = () => {
    return (
      <div className="mt-2 min-h-[50px]">
        {fieldSettings.Children && fieldSettings.Children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldSettings.Children.map((child) => (
              <FieldRenderer
                key={child.ComponentId}
                field={child}
                selectedId={selectedId}
                onSelectField={onSelectField}
                onDeleteField={onDeleteField}
                onDuplicateField={onDuplicateField}
                onUpdateField={onUpdateField}
                onMoveField={onMoveField}
                onDropNewField={onDropNewField}
              />
            ))}
          </div>
        ) : (
          <div className={`border border-dashed rounded-lg p-6 text-center text-xs text-text-secondary transition-colors ${dragOverPosition === 'inside' ? 'bg-primary/20 border-primary' : 'border-gray-700 bg-black/20'}`}>
            {dragOverPosition === 'inside' ? 'Soltar aquí para agregar' : 'Sección vacía. Arrastra campos aquí.'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => { e.stopPropagation(); onSelectField(fieldSettings.ComponentId); }}
      className={`
        relative group rounded-lg transition-all cursor-grab active:cursor-grabbing
        ${fieldSettings.Width === 'full' ? 'md:col-span-2' : 'md:col-span-1'}
        ${isSelected
          ? 'ring-2 ring-primary bg-surface-dark shadow-xl z-10'
          : isSection
            ? 'border border-border-dark bg-background-dark/30 hover:border-primary/50'
            : 'border border-transparent hover:border-border-dark hover:bg-background-dark'
        }
        ${isSection ? 'p-6 md:p-8 my-2' : 'p-6'}
        ${isSpacer ? 'opacity-70 hover:opacity-100' : ''}
      `}
    >
      <DragDropIndicators dragOverPosition={dragOverPosition} isSection={isSection} />

      <ResizeHandle
        field={fieldSettings}
        isSelected={isSelected}
        isSection={isSection}
        onUpdateWidth={handleUpdateWidth}
      />

      <FieldActions
        field={fieldSettings}
        isSelected={isSelected}
        onDuplicate={onDuplicateField}
        onDelete={onDeleteField}
      />

      <FieldIndicators
        isShared={isShared}
        hasLogic={hasLogic}
        isSection={isSection}
      />

      <div className="space-y-2 pointer-events-auto">
        {!isSpacer && !isDivider && (
          <div className="flex flex-col gap-1 mb-2">
            <label
              className={`
                block text-sm font-bold transition-colors
                ${isSection ? 'text-lg uppercase tracking-wide border-b border-border-dark pb-2 mb-2' : ''}
                ${isButtonStyleFile ? 'uppercase tracking-wide text-text-secondary' : ''}
                ${isSelected && !isButtonStyleFile && !isSection ? 'text-primary' : (isButtonStyleFile ? '' : 'text-text-primary')}
              `}
            >
              {fieldSettings.Label} {fieldSettings.Required && <span className="text-red-500">*</span>}
            </label>
            {isSection && fieldSettings.Description && (
              <div className="text-sm text-text-secondary mb-4" dangerouslySetInnerHTML={parseRichText(fieldSettings.Description)} />
            )}
          </div>
        )}

        {isSection ? renderSectionContent() : <FieldInput field={fieldSettings} />}

        {fieldSettings.Description && !isSpacer && !isDivider && !isButtonStyleFile && !isSection && (
          <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(fieldSettings.Description)} />
        )}
      </div>
    </div>
  );
};

export default FieldRenderer;
