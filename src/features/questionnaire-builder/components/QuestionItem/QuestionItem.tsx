
import React from 'react';
import { Question, AnswerOption, Indicator } from '@/types/questionnaire';
import { Input, TextArea, AutocompleteInput, Select } from '@/shared/components/ui';
import { MASTER_DATA } from '@/core/services';

interface QuestionItemProps {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onDelete: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  availableIndicators: Indicator[];
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, index, onUpdate, onDelete, onDragStart, onDragEnd, isDragging, availableIndicators }) => {
  // Generar sugerencias desde datos maestros
  const questionSuggestions = MASTER_DATA
    .filter(md => md.type === 'registry') // Solo registros con opciones
    .map(md => ({
      id: md.DataId,
      text: md.name,
      description: md.description
    }));

  const handleQuestionSelect = (selectedText: string) => {
    // Buscar la pregunta en master data
    const masterDataItem = MASTER_DATA.find(md => md.name === selectedText);
    
    if (masterDataItem && masterDataItem.options) {
      // Cargar las opciones de master data
      const newOptions = masterDataItem.options.map(opt => ({
        id: `${question.id}_${opt.DataOptionId}`,
        text: opt.value,
        score: 0,
        indicatorId: undefined
      }));
      
      onUpdate({ ...question, text: selectedText, options: newOptions });
    } else {
      onUpdate({ ...question, text: selectedText });
    }
  };
  const handleOptionChange = (index: number, field: keyof AnswerOption, value: any) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: Date.now().toString(),
      text: '',
      score: 0
    };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <div className={`bg-surface border rounded-xl p-4 pl-2 space-y-4 animate-fadeIn relative group flex gap-2 transition-all duration-200 ${
      isDragging ? 'border-primary/50 shadow-sm' : 'border-border'
    }`}>
      <div 
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData('text/plain', '');
          // Agregar efecto de arrastrar
          const dragImage = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
          dragImage.style.opacity = '0.5';
          onDragStart(index);
        }}
        onDragEnd={onDragEnd}
        className="pt-4 cursor-move text-text-secondary hover:text-primary hover:scale-110 flex-shrink-0 transition-all duration-200 active:scale-95" 
        title="Arrastrar para reordenar"
      >
        <span className="material-symbols-outlined select-none">drag_indicator</span>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <label className="text-sm text-text-primary font-medium block mb-1.5">Pregunta</label>
            <AutocompleteInput
              value={question.text}
              onChange={(value) => onUpdate({ ...question, text: value })}
              onSelect={handleQuestionSelect}
              suggestions={questionSuggestions}
              placeholder="¿Qué significa para usted una inversión de largo plazo?"
              className="font-bold text-lg"
            />
          </div>
          <div className="w-32">
            <label className="text-sm text-text-primary font-medium block mb-1.5">Peso</label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={question.weight}
              onChange={(e) => onUpdate({ ...question, weight: parseFloat(e.target.value) || 1 })}
              className="text-center"
              placeholder="1.0"
            />
          </div>
          <button
            onClick={() => onDelete(question.id)}
            className="text-text-secondary hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors mt-6"
            title="Eliminar pregunta"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_150px_40px] gap-4 px-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
            <span>Opción de Respuesta</span>
            <span className="text-center">Indicador</span>
            <span></span>
          </div>

          {question.options.map((opt, index) => (
            <div key={opt.id} className="grid grid-cols-[1fr_150px_40px] gap-4 items-center">
              <Input
                value={opt.text}
                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                placeholder="Texto de la opción"
              />
              <Select
                value={opt.indicatorId || ''}
                onChange={(e) => handleOptionChange(index, 'indicatorId', e.target.value || undefined)}
              >
                <option value="">Sin indicador</option>
                {availableIndicators.map(indicator => (
                  <option key={indicator.id} value={indicator.id}>
                    {indicator.name}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => handleRemoveOption(index)}
                className="text-text-secondary hover:text-red-500 flex justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
